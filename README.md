# Data governance DOCX text analysis in RStudio

This project provides an RStudio-ready workflow for comparing four English DOCX files about data-governance laws or policy frameworks from Europe, the United States, the UN, and China.

The workflow does **not** use `jieba`. It uses English tokenization with `tidytext::unnest_tokens()`, removes English and custom legal-document stop words, and produces word-frequency and topic-model outputs.

## Folder structure

```text
.
├── data_governance_text_analysis.Rproj
├── R/
│   └── data_governance_docx_analysis.R
└── data/
    ├── docx/
    │   ├── europe.docx
    │   ├── united_states.docx
    │   ├── un.docx
    │   └── china.docx
    └── output/
```

## How to run in RStudio

1. Open `data_governance_text_analysis.Rproj` in RStudio.
2. Put the four English DOCX files in `data/docx/`.
3. Rename the files to:
   - `europe.docx`
   - `united_states.docx`
   - `un.docx`
   - `china.docx`
4. If your file names are different, edit the `documents` table near the top of `R/data_governance_docx_analysis.R`.
5. Install the packages listed at the top of the R script if they are not already installed.
6. Run the full script: `source("R/data_governance_docx_analysis.R")`.

## Main outputs

The script writes results to `data/output/`:

- `raw_paragraphs.csv`: extracted paragraph text from each DOCX file.
- `clean_tokens.csv`: lower-cased English tokens after stop-word removal.
- `word_frequency.csv`: count, relative frequency, and rank of each word by actor.
- `top_words_by_region.csv`: most frequent words for each actor.
- `tf_idf_by_region.csv`: words that are comparatively distinctive to each actor.
- `topic_terms.csv`: top terms for each LDA topic.
- `document_topics.csv`: topic share for Europe, the United States, the UN, and China.
- `topic_labels_suggested.csv`: quick suggested topic labels based on each topic's highest-probability terms.
- `top_words_by_region.png`: faceted bar chart of frequent words.
- `topic_shares_by_region.png`: stacked topic-share chart.

## Interpreting the results

Use the frequency outputs to identify which data-governance concepts appear most often for each actor. Use `tf_idf_by_region.csv` to focus on terms that are more distinctive to one actor than to the others. Use `topic_terms.csv` and `document_topics.csv` together: first label each topic from its top terms, then compare each actor's topic shares to describe differences in detailed attention areas.

For a stronger topic model, consider splitting very long DOCX files into sections or paragraphs and modeling those smaller units instead of only four region-level documents.
