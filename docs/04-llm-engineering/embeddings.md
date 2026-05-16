# Embeddings

## Overview

Embeddings transform tokens into dense vector representations that capture semantic meaning. They are the foundation of RAG, semantic search, recommendation systems, and LLM memory.

## Core Concepts

- **Dense vectors** — fixed-size floating-point arrays (e.g. 384, 768, 1536 dimensions)
- **Semantic similarity** — measured via cosine similarity or dot-product
- **Text vs. multimodal embeddings** — some models embed text, images, and audio into a shared space
- **Embedding dimensions** — higher dimensions capture more nuance but cost more storage and compute

## Embedding Model Selection

| Model | Dimensions | Best For |
|---|---|---|
| `text-embedding-3-small` (OpenAI) | 512-1536 | General-purpose, cost-sensitive |
| `text-embedding-3-large` (OpenAI) | 256-3072 | High-accuracy retrieval |
| `BGE` (BAAI) | 768-1024 | Open-source, strong multilingual |
| `E5` (Microsoft) | 1024 | Academic benchmarks, retrieval |
| `gte` (Alibaba) | 768 | Open-source, competitive quality |

## Similarity Metrics

- **Cosine similarity** — default; measures angle between vectors
- **Dot product** — used when vectors are normalised; equivalent to cosine
- **Euclidean distance** — sensitive to magnitude; use with care

## Official Docs

https://platform.openai.com/docs/guides/embeddings

## Learning Resources

https://huggingface.co/learn

## Best Videos

https://www.youtube.com/@AndrejKarpathy

## Practice Milestones

- Generate embeddings for a document corpus and implement cosine similarity search
- Compare two embedding models on a retrieval task and measure recall@k
- Build a semantic caching layer using embeddings + ANN index

## Related Topics

- vector databases
- ANN search
- semantic similarity
- [Tokenization](tokenization.md)
- [Fine-Tuning](fine-tuning.md)
