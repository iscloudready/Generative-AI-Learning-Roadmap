# LLM Evaluation

## Why It Matters

LLM outputs are non-deterministic. Without systematic evaluation, regressions go undetected, quality degrades silently, and production incidents become inevitable. Evaluation is the single most important practice for shipping reliable AI products.

## The Seven Dimensions of LLM Evaluation

| Dimension | What It Measures | Common Metrics |
|---|---|---|
| **Accuracy** | Correctness of outputs | MMLU, GSM8K, HumanEval, BERTScore |
| **Safety** | Harmful output prevention | Jailbreak rate, toxicity scores |
| **Fairness** | Bias across demographics | Stereotype tests, demographic parity |
| **Robustness** | Stability under input variation | Perturbation tests, adversarial inputs |
| **Calibration** | Confidence alignment with correctness | Expected calibration error |
| **Efficiency** | Cost, latency, throughput | Tokens/sec, cost/query, P50/P99 latency |
| **Alignment** | Behaviour matches human intent | Likert scores, preference win-rate |

## Evaluation Approaches

### Automated Metrics
- **BLEU / ROUGE** — n-gram overlap (useful for translation/summarisation)
- **BERTScore** — embedding-based semantic similarity
- **LLM-as-a-judge** — a strong model (GPT-4, Claude) rates output quality

### Human Evaluation
- **Likert scoring** — rated by human evaluators on a 1-5 scale
- **A/B testing** — compare two model versions on live traffic
- **Preference ranking** — choose the better of two outputs

### Benchmark Frameworks
- **HELM** (Stanford) — holistic multi-dimension evaluation
- **lm-evaluation-harness** (EleutherAI) — standardised benchmark runner
- **DeepEval** — pytest-style eval suite for LLM pipelines

https://github.com/EleutherAI/lm-evaluation-harness
https://github.com/confident-ai/deepeval

### Production Monitoring
- **Drift detection** — track metric changes over time
- **Golden dataset** — fixed set of test cases run on every deployment
- **Semantic drift** — output embeddings shift across model versions

## Best Resources

### HELM (Stanford CRFM)
https://crfm.stanford.edu/helm/latest/

### LLM Evaluation Guide (Future AGI)
https://futureagi.com/blog/llm-evaluation-frameworks-metrics-best-practices

### Together AI Benchmark Guide
https://www.together.ai/blog/evaluate-and-benchmark-llms

## Practice Milestones

- Set up lm-evaluation-harness and run a model through MMLU and GSM8K
- Build an LLM-as-a-judge evaluation pipeline with a golden dataset
- Implement drift detection on a production LLM feature
- Create an eval-first development workflow: write tests before deploying prompts
- Compare 3 models on the same benchmark and document the tradeoff

## Related Topics

- [Prompt Engineering](prompt-engineering.md)
- [Fine-Tuning](fine-tuning.md)
- [AI Observability](../07-ai-infrastructure/observability.md)
