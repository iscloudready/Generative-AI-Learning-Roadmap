# Fine-Tuning

## Why It Matters

Fine-tuning adapts a pre-trained LLM to a specific task, domain, or behaviour. It improves output quality, reduces hallucination, and can lower costs by letting you use a smaller model for the same task quality.

## When to Fine-Tune vs. Prompt vs. RAG

| Approach | Best For | Effort |
|---|---|---|
| Prompt engineering | Simple tasks, rapid iteration | Low |
| RAG | Knowledge-heavy, frequently updated data | Medium |
| **Fine-tuning** | Domain-specific style/format, consistent behaviour | High |

Fine-tuning is rarely the first step — start with prompting, add RAG if needed, then fine-tune if quality still lags.

## Parameter-Efficient Fine-Tuning (PEFT)

### LoRA (Low-Rank Adaptation)
Adds small trainable rank matrices to attention layers. Keeps base model frozen, trains only ~0.1-1% of parameters.

https://arxiv.org/abs/2106.09685

### QLoRA
LoRA + 4-bit quantisation of base model. Enables fine-tuning 70B models on a single consumer GPU.

https://arxiv.org/abs/2305.14314

### DoRA (Weight-Decomposed Low-Rank Adaptation)
Improves on LoRA by decomposing updates into magnitude and direction components.

https://arxiv.org/abs/2402.09353

### PiSSA
Principal Singular Values and Singular Vectors Adaptation — initialises adapters with principal components of the base model.

## Alignment Techniques

### RLHF (Reinforcement Learning from Human Feedback)
Three-stage: SFT → reward model training → PPO optimisation. Complex and expensive but produces strong alignment.

https://arxiv.org/abs/2203.02155

### DPO (Direct Preference Optimization)
Simpler alternative to RLHF. Optimises directly on preference pairs without a separate reward model. Now the default for most teams.

https://arxiv.org/abs/2305.18290

### GRPO (Group Relative Policy Optimization)
Used by DeepSeek R1. Group-based advantage estimation, no critic network.

## Dataset Curation

- **Quality over quantity** — 1k high-quality examples beats 100k noisy ones
- **Diverse coverage** — include edge cases the model will face in production
- **Preference pairs** — for DPO, collect chosen/rejected pairs with clear quality differences
- **Decontamination** — check for benchmark overlap

## Best Resources

### Hugging Face TRL
https://github.com/huggingface/trl

### Unsloth (optimised LoRA/QLoRA training)
https://github.com/unslothai/unsloth

### Axolotl (fine-tuning framework)
https://github.com/OpenAccess-AI-Collective/axolotl

### Advanced LoRA Fine-Tuning Guide
https://kaitchup.substack.com/p/advanced-lora-fine-tuning-how-to

## Practice Milestones

- Fine-tune a 7B model with LoRA on a domain-specific dataset (e.g. legal, medical, code)
- Apply QLoRA to fine-tune a 70B model on a consumer GPU (colab or local)
- Implement DPO alignment using preference pairs
- Compare output quality before and after fine-tuning using an eval suite
- Measure the cost-quality tradeoff: fine-tuned small model vs. prompted large model

## Related Topics

- [Prompt Engineering](prompt-engineering.md)
- [Evaluation](evaluation.md)
- [LLMOps and AI Infrastructure](../07-ai-infrastructure/llmops.md)
