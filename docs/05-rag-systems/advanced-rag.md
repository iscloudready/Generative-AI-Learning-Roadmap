# Advanced RAG Patterns

## Why Advanced RAG

Basic RAG (embed → retrieve → generate) fails on complex queries: multi-step reasoning, cross-document relationships, and nuanced domain questions. Advanced patterns add self-correction, structured knowledge, and agentic decision-making.

## Graph RAG

Uses a knowledge graph to capture entity relationships. Retrieval operates over graph nodes and edges rather than flat chunks.

**How it works:**
1. Extract entities and relationships from documents
2. Build a knowledge graph (community detection, hierarchical clustering)
3. At query time, traverse the graph to find relevant subgraphs
4. Generate answers conditioned on graph context

**Best for:** Multi-document questions, entity-relationship queries, summarisation across topics

https://arxiv.org/abs/2404.16130
https://microsoft.github.io/graphrag/

## Agentic RAG

The LLM acts as an agent that can decide when and how to retrieve. Instead of a fixed retrieve-and-generate flow, the agent decomposes queries, chooses retrieval sources, iterates, and self-corrects.

**Key capabilities:**
- Query decomposition (break complex questions into sub-questions)
- Multi-source retrieval (vector DB, web, API, SQL)
- Self-correction (if retrieved results are insufficient, try again)
- Tool use (call external tools during retrieval)

**Best for:** Complex, multi-step questions requiring synthesis across sources

## Self-RAG

The model retrieves passages but also generates a reflection token indicating whether the passage is relevant. It can decide to retrieve more, use a retrieved passage, or skip retrieval entirely.

https://arxiv.org/abs/2310.11511

## Corrective RAG (CRAG)

Adds a retrieval evaluator that assesses retrieved document quality. If quality is low, it triggers an alternative retrieval strategy (web search instead of vector DB).

https://arxiv.org/abs/2401.15884

## Multi-Hop RAG

The model answers a question by chaining multiple retrieval-and-reasoning steps. Each hop answers an intermediate question that feeds into the next.

**Example:** "Which company acquired the startup founded by the author of Attention Is All You Need?" → Hop 1: find author → Hop 2: find startup → Hop 3: find acquirer

## Comparison

| Pattern | Complexity | Quality Gain | Use When |
|---|---|---|---|
| Basic RAG | Low | Baseline | Simple Q&A |
| Graph RAG | High | High | Entity-heavy domains |
| Agentic RAG | Very high | Very high | Complex multi-step |
| Self-RAG | Medium | Medium | Variable quality sources |
| CRAG | Medium | Medium | Unreliable retrieval |
| Multi-Hop | High | High | Multi-step reasoning |

## Best Resources

### Agentic RAG Explained in 3 Levels of Difficulty
https://machinelearningmastery.com/agentic-rag-explained-in-3-levels-of-difficulty

### GraphRAG (Microsoft)
https://microsoft.github.io/graphrag/

### Advanced RAG Patterns (LangChain blog)
https://blog.langchain.dev/advanced-rag/

## Practice Milestones

- Implement Self-RAG with a reflection token
- Build a Graph RAG pipeline on a small document corpus using Microsoft's GraphRAG
- Implement Agentic RAG with query decomposition and multi-source retrieval
- Benchmark advanced RAG vs. basic RAG on a complex QA dataset (e.g. HotPotQA)

## Related Topics

- [RAG Overview](rag-overview.md)
- [AI Agents](../06-ai-agents/agents.md)
- [AI Agent Patterns](../06-ai-agents/agent-patterns.md)
