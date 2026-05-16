# Tokenization

## Why It Matters

Tokenization is the first step in every LLM pipeline. It converts text into integer token IDs that the model can process. Tokenizer choice affects model quality, context utilisation, inference cost, and multilingual performance.

## Core Concepts

- **Vocabulary** — the set of tokens the model knows
- **Encoding** — text → token IDs
- **Decoding** — token IDs → text
- **Special tokens** — `[BOS]`, `[EOS]`, `[PAD]`, `[SEP]`, `[CLS]`

## Tokenization Algorithms

### BPE (Byte-Pair Encoding)
Used by GPT-family models. Merges frequent character pairs iteratively. Sub-word level.

https://en.wikipedia.org/wiki/Byte_pair_encoding

### WordPiece
Used by BERT. Similar to BPE but merges based on likelihood gain rather than frequency.

### SentencePiece
Used by T5, Llama, Gemma. Language-agnostic; works directly on raw text without pre-tokenization.

https://github.com/google/sentencepiece

### TikToken (OpenAI)
OpenAI's fast BPE implementation for GPT-4 / GPT-4o models.

https://github.com/openai/tiktoken

## Vocabulary Size Decisions

| Model | Vocabulary Size | Notes |
|---|---|---|
| GPT-4 | ~100k | Large vocab reduces tokens per word |
| Llama 3 | 128k | Multilingual support |
| BERT | 30k | Smaller vocab, more tokens per word |
| Gemma 4 | 256k | Massive vocab for efficient multilingual |

A larger vocabulary means fewer tokens per word (cheaper inference) but a larger embedding table (more parameters).

## Best Resources

### Hugging Face Tokenizers
https://huggingface.co/docs/tokenizers/index

### OpenAI Tokeniser Playground
https://platform.openai.com/tokenizer

### TikToken Repository
https://github.com/openai/tiktoken

## Practice Milestones

- Compare token counts for the same text across 3 different tokenisers
- Estimate inference cost for a document using GPT-4 tokenizer
- Implement a simple BPE tokeniser from scratch on a toy corpus

## Related Topics

- [Embeddings](embeddings.md)
- [Fine-Tuning](fine-tuning.md)
