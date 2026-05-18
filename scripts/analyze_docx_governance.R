#!/usr/bin/env Rscript

# Analyze Chinese and English DOCX files for data/digital governance research.
# Outputs comparable word frequencies and an exploratory per-document LDA summary.

suppressPackageStartupMessages({
  library(dplyr)
  library(jiebaR)
  library(officer)
  library(purrr)
  library(readr)
  library(stringr)
  library(tibble)
  library(tidyr)
  library(tidytext)
  library(topicmodels)
})

english_stopwords <- c(
  "a", "about", "above", "according", "across", "after", "again", "against",
  "all", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be",
  "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few",
  "for", "from", "further", "had", "has", "have", "having", "he", "her", "here",
  "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", "is",
  "it", "its", "itself", "just", "may", "more", "most", "must", "my", "myself", "no",
  "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "our",
  "ours", "ourselves", "out", "over", "own", "same", "shall", "she", "should", "so",
  "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
  "then", "there", "these", "they", "this", "those", "through", "to", "too", "under",
  "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while",
  "who", "whom", "why", "will", "with", "within", "would", "you", "your", "yours",
  "yourself", "yourselves"
)

chinese_stopwords <- c(
  "的", "了", "和", "与", "及", "或", "并", "在", "对", "为", "是", "于", "中", "由", "将",
  "应", "该", "其", "本", "等", "以", "但", "而", "且", "就", "都", "也", "被", "把", "从",
  "到", "向", "根据", "有关", "相关", "进行", "可以", "不得", "以及", "或者", "如果", "需要",
  "通过", "采取", "包括", "具有", "关于", "一个", "一种", "第", "条", "款", "项", "章"
)

parse_args <- function(args) {
  values <- list(
    input_dir = "data",
    output_dir = "outputs",
    language_map = "",
    extra_stopwords = "stopwords/custom_stopwords.txt",
    top_n = 50,
    topics = 3,
    words_per_topic = 12,
    min_token_len = 2,
    min_topic_tokens = 30
  )
  i <- 1
  while (i <= length(args)) {
    key <- args[[i]]
    if (!startsWith(key, "--") || i == length(args)) {
      stop("Arguments must be provided as --name value pairs.")
    }
    value <- args[[i + 1]]
    name <- gsub("-", "_", sub("^--", "", key))
    if (!name %in% names(values)) {
      stop(paste("Unknown option:", key))
    }
    values[[name]] <- value
    i <- i + 2
  }
  numeric_names <- c("top_n", "topics", "words_per_topic", "min_token_len", "min_topic_tokens")
  for (name in numeric_names) {
    values[[name]] <- as.integer(values[[name]])
  }
  values
}

parse_language_map <- function(raw_map) {
  if (is.null(raw_map) || raw_map == "") {
    return(character())
  }
  items <- str_split(raw_map, ",", simplify = FALSE)[[1]]
  pairs <- str_split_fixed(items, ":", 2)
  if (any(pairs[, 2] == "") || any(!pairs[, 2] %in% c("zh", "en"))) {
    stop("Language map must look like 'china:zh,eu:en'.")
  }
  stats::setNames(pairs[, 2], tolower(str_trim(pairs[, 1])))
}

read_extra_stopwords <- function(path) {
  if (!file.exists(path)) {
    return(character())
  }
  read_lines(path) |>
    str_trim() |>
    purrr::discard(~ .x == "" || startsWith(.x, "#")) |>
    tolower()
}

read_docx_paragraphs <- function(path) {
  document <- read_docx(path)
  content <- docx_summary(document)
  content |>
    filter(content_type == "paragraph", !is.na(text), str_trim(text) != "") |>
    pull(text)
}

guess_language <- function(text) {
  cjk_count <- str_count(text, "[\\u4e00-\\u9fff]")
  latin_count <- str_count(text, "[A-Za-z]")
  ifelse(cjk_count > latin_count, "zh", "en")
}

tokenize_english <- function(text, stopwords, min_token_len) {
  tokens <- str_extract_all(tolower(text), "[a-zA-Z][a-zA-Z\\-']*[a-zA-Z]")[[1]]
  tokens <- str_replace_all(tokens, "^[\\-']|[\\-']$", "")
  tokens[nchar(tokens) >= min_token_len & !tokens %in% stopwords]
}

tokenize_chinese <- function(text, stopwords, min_token_len, worker) {
  tokens <- segment(text, worker)
  tokens <- tolower(str_trim(tokens))
  tokens <- tokens[tokens != "" & !tokens %in% stopwords]
  tokens <- tokens[!str_detect(tokens, "^[[:punct:]_]+$")]
  cjk_tokens <- tokens[str_detect(tokens, "[\\u4e00-\\u9fff]") & nchar(tokens) >= min_token_len]
  latin_tokens <- tokens[!str_detect(tokens, "[\\u4e00-\\u9fff]") & nchar(tokens) >= min_token_len & !tokens %in% english_stopwords]
  c(cjk_tokens, latin_tokens)
}

tokenize_text <- function(text, language, extra_stopwords, min_token_len, worker) {
  if (language == "zh") {
    return(tokenize_chinese(text, c(chinese_stopwords, extra_stopwords), min_token_len, worker))
  }
  tokenize_english(text, c(english_stopwords, extra_stopwords), min_token_len)
}

make_chunks <- function(paragraphs, language, extra_stopwords, min_token_len, min_topic_tokens, worker) {
  chunks <- character()
  current <- character()
  for (paragraph in paragraphs) {
    tokens <- tokenize_text(paragraph, language, extra_stopwords, min_token_len, worker)
    if (length(tokens) == 0) {
      next
    }
    current <- c(current, tokens)
    if (length(current) >= min_topic_tokens) {
      chunks <- c(chunks, paste(current, collapse = " "))
      current <- character()
    }
  }
  if (length(current) > 0) {
    if (length(chunks) > 0) {
      chunks[[length(chunks)]] <- paste(chunks[[length(chunks)]], paste(current, collapse = " "))
    } else if (length(current) >= max(5, floor(min_topic_tokens / 2))) {
      chunks <- c(chunks, paste(current, collapse = " "))
    }
  }
  chunks
}

write_frequency_outputs <- function(records, output_dir, top_n) {
  token_rows <- map_dfr(records, function(record) {
    tibble(document = record$name, language = record$language, token = record$tokens)
  })

  summary <- map_dfr(records, function(record) {
    tibble(
      document = record$name,
      language = record$language,
      source_file = record$path,
      total_tokens_after_stopword_removal = length(record$tokens),
      unique_tokens = n_distinct(record$tokens)
    )
  })

  frequencies <- token_rows |>
    count(document, language, token, name = "count") |>
    left_join(summary |> select(document, total_tokens_after_stopword_removal), by = "document") |>
    mutate(freq_per_10k = if_else(total_tokens_after_stopword_removal > 0,
      count / total_tokens_after_stopword_removal * 10000,
      0
    )) |>
    select(document, language, token, count, freq_per_10k) |>
    arrange(document, desc(freq_per_10k), desc(count), token)

  top_words <- frequencies |>
    group_by(document) |>
    slice_head(n = top_n) |>
    ungroup()

  comparison <- top_words |>
    select(document, token, freq_per_10k) |>
    pivot_wider(names_from = token, values_from = freq_per_10k, values_fill = 0)

  write_csv(summary, file.path(output_dir, "document_summary.csv"))
  write_csv(frequencies, file.path(output_dir, "word_frequencies.csv"))
  write_csv(top_words, file.path(output_dir, "top_words_by_document.csv"))
  write_csv(comparison, file.path(output_dir, "comparison_matrix.csv"))
}

write_lda_outputs <- function(records, output_dir, topics, words_per_topic, extra_stopwords, min_token_len, min_topic_tokens, worker) {
  topic_rows <- list()
  assignment_rows <- list()

  for (record in records) {
    chunks <- make_chunks(record$paragraphs, record$language, extra_stopwords, min_token_len, min_topic_tokens, worker)
    if (length(chunks) < 2) {
      topic_rows[[length(topic_rows) + 1]] <- tibble(
        document = record$name,
        topic = "skipped",
        top_terms = "",
        note = "Not enough paragraph chunks for LDA. Try lowering --min-topic-tokens."
      )
      next
    }

    chunk_tokens <- tibble(chunk = seq_along(chunks), text = chunks) |>
      unnest_tokens(token, text, token = "regex", pattern = "\\s+") |>
      count(chunk, token, name = "n")

    dtm <- chunk_tokens |>
      cast_dtm(document = chunk, term = token, value = n)

    topic_count <- min(topics, max(1, length(chunks) - 1), ncol(dtm))
    model <- LDA(dtm, k = topic_count, control = list(seed = 42))

    terms <- tidy(model, matrix = "beta") |>
      group_by(topic) |>
      slice_max(beta, n = words_per_topic, with_ties = FALSE) |>
      summarise(top_terms = paste(term, collapse = ", "), .groups = "drop") |>
      mutate(document = record$name, note = "") |>
      select(document, topic, top_terms, note)
    topic_rows[[length(topic_rows) + 1]] <- terms

    assignments <- tidy(model, matrix = "gamma") |>
      rename(chunk_id = document) |>
      group_by(chunk_id) |>
      slice_max(gamma, n = 1, with_ties = FALSE) |>
      ungroup() |>
      mutate(chunk = as.integer(as.character(chunk_id))) |>
      transmute(
        document = record$name,
        chunk = chunk,
        dominant_topic = topic,
        dominant_topic_probability = gamma,
        token_count = lengths(str_split(chunks[chunk], "\\s+")),
        chunk_preview = map_chr(chunks[chunk], ~ paste(head(str_split(.x, "\\s+")[[1]], 40), collapse = " "))
      )
    assignment_rows[[length(assignment_rows) + 1]] <- assignments
  }

  bind_rows(topic_rows) |> write_csv(file.path(output_dir, "lda_topics.csv"))
  bind_rows(assignment_rows) |> write_csv(file.path(output_dir, "lda_chunk_topics.csv"))
}

main <- function() {
  args <- parse_args(commandArgs(trailingOnly = TRUE))
  dir.create(args$output_dir, recursive = TRUE, showWarnings = FALSE)
  language_map <- parse_language_map(args$language_map)
  extra_stopwords <- read_extra_stopwords(args$extra_stopwords)
  jieba_worker <- jiebaR::worker()

  docx_files <- list.files(args$input_dir, pattern = "\\.docx$", full.names = TRUE)
  if (length(docx_files) == 0) {
    stop(paste("No .docx files found in", args$input_dir))
  }

  records <- map(docx_files, function(path) {
    paragraphs <- read_docx_paragraphs(path)
    name <- tools::file_path_sans_ext(basename(path))
    language <- if (tolower(name) %in% names(language_map)) language_map[[tolower(name)]] else guess_language(paste(paragraphs, collapse = "\n"))
    tokens <- tokenize_text(paste(paragraphs, collapse = "\n"), language, extra_stopwords, args$min_token_len, jieba_worker)
    list(name = name, path = path, language = language, paragraphs = paragraphs, tokens = tokens)
  })

  write_frequency_outputs(records, args$output_dir, args$top_n)
  write_lda_outputs(records, args$output_dir, args$topics, args$words_per_topic, extra_stopwords, args$min_token_len, args$min_topic_tokens, jieba_worker)
  message("Analyzed ", length(records), " DOCX file(s). Outputs written to ", args$output_dir, ".")
}

main()
