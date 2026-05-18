# Data governance DOCX text-mining workflow in RStudio
# ------------------------------------------------------
# Purpose: compare four English data-governance legal/policy documents
#          (Europe, United States, UN, China) by tokenization, stop-word
#          removal, word frequency, most common terms, and topic modeling.
# Note: This workflow intentionally does not use jieba. It uses English
#       tokenization from tidytext/unnest_tokens.

# 1) Install packages once if needed:
# install.packages(c(
#   "officer", "tidyverse", "tidytext", "stopwords", "topicmodels",
#   "broom", "scales"
# ))

library(officer)
library(tidyverse)
library(tidytext)
library(stopwords)
library(topicmodels)
library(broom)
library(scales)

# -----------------------------
# 2) User settings
# -----------------------------
# Put your four .docx files in data/docx/ and edit the file names below.
# The region labels are used throughout the outputs and plots.
documents <- tibble::tribble(
  ~region,          ~file,
  "Europe",        "data/docx/europe.docx",
  "United States", "data/docx/united_states.docx",
  "UN",            "data/docx/un.docx",
  "China",         "data/docx/china.docx"
)

output_dir <- "data/output"
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Adjust these if you want more/fewer words or topics in the outputs.
top_n_words <- 30
number_of_topics <- 6
set.seed(20260518)

# Add domain-specific words that should not drive the comparison.
# Keep legally meaningful words such as "privacy", "security", "rights",
# "cross", "border", "personal", and "public" unless you deliberately
# want to remove them.
custom_stop_words <- c(
  "article", "section", "chapter", "paragraph", "subsection", "annex",
  "act", "law", "regulation", "directive", "policy", "shall", "may",
  "including", "include", "includes", "thereof", "hereby", "whereas",
  "within", "without", "pursuant", "provided", "following", "set", "forth",
  "page", "pages", "document", "documents"
)

# -----------------------------
# 3) Read DOCX files
# -----------------------------
missing_files <- documents %>%
  filter(!file.exists(file))

if (nrow(missing_files) > 0) {
  stop(
    "Missing DOCX file(s):\n",
    paste0("- ", missing_files$region, ": ", missing_files$file, collapse = "\n"),
    "\n\nPut your files in data/docx/ or edit the `documents` table."
  )
}

read_docx_text <- function(path) {
  officer::read_docx(path) %>%
    officer::docx_summary() %>%
    filter(content_type == "paragraph") %>%
    transmute(text = str_squish(text)) %>%
    filter(!is.na(text), text != "")
}

raw_text <- documents %>%
  mutate(text_tbl = map(file, read_docx_text)) %>%
  select(region, text_tbl) %>%
  unnest(text_tbl) %>%
  group_by(region) %>%
  mutate(paragraph_id = row_number()) %>%
  ungroup()

readr::write_csv(raw_text, file.path(output_dir, "raw_paragraphs.csv"))

# -----------------------------
# 4) Tokenize and remove stop words
# -----------------------------
english_stop_words <- tibble(word = unique(c(
  tidytext::stop_words$word,
  stopwords::stopwords("en"),
  custom_stop_words
)))

tokens <- raw_text %>%
  unnest_tokens(
    output = word,
    input = text,
    token = "words",
    to_lower = TRUE,
    strip_numeric = TRUE
  ) %>%
  mutate(word = str_replace_all(word, "[^a-z]", "")) %>%
  filter(str_detect(word, "^[a-z]+$"), str_length(word) >= 3) %>%
  anti_join(english_stop_words, by = "word")

readr::write_csv(tokens, file.path(output_dir, "clean_tokens.csv"))

# -----------------------------
# 5) Word frequency and most common words
# -----------------------------
word_frequency <- tokens %>%
  count(region, word, sort = TRUE) %>%
  group_by(region) %>%
  mutate(
    total_tokens = sum(n),
    relative_frequency = n / total_tokens,
    rank = row_number()
  ) %>%
  ungroup()

readr::write_csv(word_frequency, file.path(output_dir, "word_frequency.csv"))

top_words_by_region <- word_frequency %>%
  group_by(region) %>%
  slice_max(order_by = n, n = top_n_words, with_ties = FALSE) %>%
  ungroup()

readr::write_csv(top_words_by_region, file.path(output_dir, "top_words_by_region.csv"))

# Overall words that distinguish a region, using tf-idf.
tf_idf_by_region <- tokens %>%
  count(region, word, sort = TRUE) %>%
  bind_tf_idf(term = word, document = region, n = n) %>%
  arrange(desc(tf_idf))

readr::write_csv(tf_idf_by_region, file.path(output_dir, "tf_idf_by_region.csv"))

# -----------------------------
# 6) Topic modeling
# -----------------------------
# Build one topic-model document per region. This is suitable for a compact
# four-document comparison; if your DOCX files are very long, you may also split
# by paragraph or section before building the document-term matrix.
dtm <- tokens %>%
  count(region, word) %>%
  cast_dtm(document = region, term = word, value = n)

lda_model <- topicmodels::LDA(
  dtm,
  k = number_of_topics,
  control = list(seed = 20260518)
)

topic_terms <- tidy(lda_model, matrix = "beta") %>%
  group_by(topic) %>%
  slice_max(beta, n = 15, with_ties = FALSE) %>%
  arrange(topic, desc(beta)) %>%
  ungroup()

document_topics <- tidy(lda_model, matrix = "gamma") %>%
  rename(region = document, topic_share = gamma) %>%
  arrange(region, desc(topic_share))

readr::write_csv(topic_terms, file.path(output_dir, "topic_terms.csv"))
readr::write_csv(document_topics, file.path(output_dir, "document_topics.csv"))

# Optional human-readable topic labels based on each topic's top terms.
topic_labels <- topic_terms %>%
  group_by(topic) %>%
  summarise(
    suggested_label = paste(head(term, 5), collapse = " / "),
    .groups = "drop"
  )

readr::write_csv(topic_labels, file.path(output_dir, "topic_labels_suggested.csv"))

# -----------------------------
# 7) Visualizations
# -----------------------------
top_words_plot <- top_words_by_region %>%
  mutate(word = reorder_within(word, n, region)) %>%
  ggplot(aes(x = n, y = word, fill = region)) +
  geom_col(show.legend = FALSE) +
  facet_wrap(~ region, scales = "free_y") +
  scale_y_reordered() +
  labs(
    title = "Most frequent non-stop words by data-governance actor",
    x = "Word count",
    y = NULL
  ) +
  theme_minimal(base_size = 12)

ggsave(
  filename = file.path(output_dir, "top_words_by_region.png"),
  plot = top_words_plot,
  width = 12,
  height = 8,
  dpi = 300
)

topic_share_plot <- document_topics %>%
  mutate(topic = factor(topic)) %>%
  ggplot(aes(x = region, y = topic_share, fill = topic)) +
  geom_col(position = "fill") +
  scale_y_continuous(labels = percent_format()) +
  labs(
    title = "Estimated topic composition by data-governance actor",
    x = NULL,
    y = "Share within actor document",
    fill = "Topic"
  ) +
  theme_minimal(base_size = 12) +
  theme(axis.text.x = element_text(angle = 30, hjust = 1))

ggsave(
  filename = file.path(output_dir, "topic_shares_by_region.png"),
  plot = topic_share_plot,
  width = 10,
  height = 6,
  dpi = 300
)

# -----------------------------
# 8) Console summary
# -----------------------------
message("Analysis complete. Main outputs are in: ", normalizePath(output_dir))
message("Key CSV files:")
message("- word_frequency.csv")
message("- top_words_by_region.csv")
message("- tf_idf_by_region.csv")
message("- topic_terms.csv")
message("- document_topics.csv")
