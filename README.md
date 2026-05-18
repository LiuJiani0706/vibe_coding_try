# Digital governance document text analysis

This repository contains Python and R scripts for comparing four `.docx` files (for example: EU, China, USA, and UN digital/data governance documents).

The scripts can:

- read `.docx` files from a folder;
- tokenize Chinese and English documents;
- remove stopwords;
- compute raw and normalized word frequency (per 10,000 tokens), which is better for comparing documents of different lengths;
- export top keywords for each document and a cross-document comparison table;
- run a lightweight per-document LDA-style topic model over paragraph chunks.

## Suggested input layout

Put your files in `data/` and name them with the actor name, for example:

```text
data/
  china.docx
  eu.docx
  usa.docx
  un.docx
```

You may use other names. The scripts use the filename as the document/actor label.

## Python usage

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the analysis:

```bash
python scripts/analyze_docx_governance.py --input-dir data --output-dir outputs --top-n 50 --topics 3
```

Useful options:

- `--language-map china:zh,eu:en,usa:en,un:en` manually assigns languages by filename stem.
- `--extra-stopwords stopwords/custom_stopwords.txt` adds one custom stopword per line.
- `--min-topic-tokens 30` controls the minimum token count for each paragraph chunk used by the topic model.

## R usage

Install dependencies in R:

```r
install.packages(c("officer", "dplyr", "stringr", "readr", "tidyr", "purrr", "tidytext", "jiebaR", "topicmodels", "tm"))
```

Run the analysis:

```bash
Rscript scripts/analyze_docx_governance.R --input-dir data --output-dir outputs --top-n 50 --topics 3
```

Optional language map:

```bash
Rscript scripts/analyze_docx_governance.R --input-dir data --language-map china:zh,eu:en,usa:en,un:en
```

## Output files

Both scripts produce files in `outputs/`:

- `document_summary.csv`: total token counts by document.
- `word_frequencies.csv`: all retained tokens with raw count and normalized frequency per 10,000 tokens.
- `top_words_by_document.csv`: top words for each document.
- `comparison_matrix.csv`: document-by-word matrix using normalized frequency.
- `lda_topics.csv`: topic keywords by document.
- `lda_chunk_topics.csv`: paragraph chunk topic assignments, when available.

## Notes for interpretation

- Use `freq_per_10k` rather than raw `count` when comparing documents of different lengths.
- LDA is less stable with very few documents. These scripts therefore split each document into paragraph chunks and run a small topic model within each document. Treat the resulting topics as exploratory summaries rather than definitive findings.
- For governance texts, add domain-generic words such as `article`, `chapter`, `shall`, `规定`, `办法`, or `数据` to `stopwords/custom_stopwords.txt` if they dominate the output but are not analytically useful.
