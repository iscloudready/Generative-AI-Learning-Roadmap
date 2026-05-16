# Retrieval-Augmented Generation (RAG)

## What Is RAG?

RAG combines retrieval systems with LLM reasoning. Instead of relying solely on the model's parametric knowledge, RAG retrieves relevant documents from an external knowledge base and conditions the LLM's generation on them.

## Why RAG Matters

RAG helps reduce:
- hallucinations (grounding in retrieved facts)
- stale knowledge (database can be updated without retraining)
- context limitations (retrieve what's needed, not everything)

## Core Components

### Ingestion Pipeline
1. Document loading (PDFs, websites, databases, code repos)
2. Chunking (splitting documents into manageable pieces)
3. Embedding (converting chunks to vectors)
4. Indexing (storing vectors in a searchable index)

### Retrieval Pipeline
1. Query embedding
2. Vector search (ANN index lookup)
3. Optional hybrid search (dense + sparse/BM25)
4. Optional reranking (cross-encoder re-scores top-k results)
5. Context assembly (format retrieved chunks for the LLM prompt)

## Chunking Strategies

| Strategy | How It Works | Best For |
|---|---|---|
| Fixed-size | Split by character/token count | Simple, fast |
| Recursive | Split by paragraph → sentence → word | Balanced |
| Semantic | Split at natural topic boundaries | High-quality retrieval |
| Agentic | LLM decides chunk boundaries | Flexible but expensive |

## Hybrid Search

Dense retrieval (vector search) captures semantic similarity. Sparse retrieval (BM25, SPLADE) captures exact keyword matches. Hybrid combines both, typically with a weighted sum or reciprocal rank fusion.

https://www.pinecone.io/learn/hybrid-search/

## Reranking

A cross-encoder model scores each retrieved chunk for relevance to the query. This is more accurate than embedding similarity but slower, so apply it after the initial ANN search narrows candidates to top-20 or top-50.

https://www.sbert.net/examples/applications/cross-encoder/README.html

## Best Learning Resources

### Pinecone Learn
https://www.pinecone.io/learn/

### Weaviate Academy
https://weaviate.io/developers/academy

### LlamaIndex
https://www.llamaindex.ai/

## Foundational Paper
https://arxiv.org/abs/2005.11401

## Practice Milestones

- Build a basic RAG pipeline: ingest PDFs → chunk → embed → retrieve → generate
- Compare fixed-size vs. semantic chunking on the same document set
- Add hybrid search (dense + BM25) and measure recall improvement
- Add a reranking step and measure top-1 accuracy improvement
- Benchmark pipeline latency and identify the bottleneck

## Related Topics

- [Embeddings](../04-llm-engineering/embeddings.md)
- [Advanced RAG Patterns](advanced-rag.md)
- [Vector Databases](../08-open-source-ai/open-source-ai.md)
