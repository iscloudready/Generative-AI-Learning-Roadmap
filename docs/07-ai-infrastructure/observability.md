# AI Observability

## Why It Matters

LLM outputs are non-deterministic and context-dependent. Traditional monitoring (error rates, latency) is insufficient. AI observability adds tracing, evaluation, and drift detection across the full request lifecycle.

## The Observability Stack

### OpenTelemetry
The industry standard for instrumenting AI applications. The `gen_ai.*` attribute namespace (stable in OTel 1.30) standardises spans for LLM calls, embeddings, vector DB queries, and agent steps.

https://opentelemetry.io/

### Tracing Spans
Every LLM call, retrieval step, tool execution, and agent decision generates a span. Spans capture:
- Input/output tokens and counts
- Model name, temperature, other parameters
- Latency per operation
- Error codes and retry events

## Key Metrics to Track

| Metric | What It Reveals | Alert Threshold |
|---|---|---|
| P50/P99 latency | User experience | > 2s P50, > 10s P99 |
| Token throughput | Cost efficiency | Monitor trend |
| Error rate | Model/tool failures | > 1% |
| Hallucination score | Output quality | Score drift > 5% |
| Cost per query | Budget tracking | Per-query cost increase |
| Retrieval relevance | RAG quality | Relevance score < 0.7 |

## Tools Comparison

| Tool | Best For | Open Source | Self-Hostable |
|---|---|---|---|
| **Langfuse** | Tracing, eval, dataset management | Yes | Yes |
| **LangSmith** | LangChain-native, eval, playground | No | No |
| **Arize Phoenix** | LLM-as-a-judge, local dev | Yes | Yes |
| **Weights & Biases Weave** | Experiment tracking, teams | No | No |
| **Datadog AI** | Full-stack observability | No | No |
| **Helicone** | Proxy-based cost/logging | No | No |

### Langfuse
https://langfuse.com/

### Arize Phoenix
https://github.com/Arize-AI/phoenix

### LangSmith
https://smith.langchain.com/

## Continuous Evaluation

Run LLM-as-a-judge evaluations on sampled production traffic. Compare against a golden dataset to detect:
- Semantic drift (outputs change over time)
- Quality regression (new prompts or models degrade quality)
- Edge cases (unusual inputs that break the system)

## Practice Milestones

- Instrument a RAG pipeline with OpenTelemetry and trace all LLM calls
- Set up Langfuse and create a dashboard of key metrics
- Build a continuous eval pipeline that scores 10% of production traffic
- Set up alerts for latency, error rate, and cost drift
- Implement A/B comparison between two model versions using production traces

## Related Topics

- [LLM Evaluation](../04-llm-engineering/evaluation.md)
- [LLMOps and AI Infrastructure](llmops.md)
- [AI Agent Patterns](../06-ai-agents/agent-patterns.md)
