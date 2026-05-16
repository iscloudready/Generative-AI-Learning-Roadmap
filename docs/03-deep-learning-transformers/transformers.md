# Transformers

## Why Transformers Changed AI

Transformers introduced the attention mechanism, which enables models to weigh the importance of different input tokens regardless of their position. This removed the sequential bottleneck of RNNs and unlocked parallel training at scale.

Transformers enabled:
- modern LLMs (GPT, Claude, Llama, Gemini)
- multimodal AI (vision transformers, audio transformers)
- embeddings and semantic search
- AI agents and reasoning systems

## Core Concepts

### Attention Mechanism
Each token attends to all other tokens in the sequence. The attention score is computed as:

`Attention(Q, K, V) = softmax(Q × K^T / √d_k) × V`

- **Q** (query) — what this token is looking for
- **K** (key) — what each token offers
- **V** (value) — the information to pass through
- **√d_k** — scaling factor to prevent softmax saturation

### Multi-Head Attention
Multiple attention heads run in parallel, each learning different relationships (syntax, semantics, position). Outputs are concatenated and projected.

### Positional Encoding
Since attention is position-invariant, positional information must be added explicitly:
- **Absolute** (sinusoidal, learned) — fixed position per token
- **Relative** (RoPE, ALiBi) — position relative to other tokens; better length generalisation

### Encoder vs. Decoder vs. Encoder-Decoder

| Architecture | Examples | Best For |
|---|---|---|
| Encoder-only | BERT, RoBERTa | Classification, NER, embedding |
| Decoder-only | GPT, Llama, Claude | Generation, chat, reasoning |
| Encoder-Decoder | T5, BART | Translation, summarisation |

## Scaling Laws

Model performance improves predictably with more parameters, data, and compute. Key findings from Kaplan et al. (2020):

- Performance follows a power-law with dataset size, model size, and compute budget
- Chinchilla scaling (Hoffmann et al., 2022): for optimal training, scale model and data proportionally
- Inference scaling (2024+): spending more compute at inference time (CoT, self-consistency) can outperform larger models

https://arxiv.org/abs/2001.08361
https://arxiv.org/abs/2203.15556

## Mixture-of-Experts (MoE)

MoE architectures activate only a subset of parameters per token, enabling larger models without proportional compute costs.

- **Core mechanism**: A learned router network selects the top-K "expert" feed-forward networks for each token. Only the selected experts' parameters are computed; unselected experts remain idle.
- **Key models**: Mixtral 8x7B (Mistral), Mixtral 8x22B, DeepSeek-V2, DBRX (Databricks), GPT-4 (rumored MoE)
- **Challenges**: Load balancing (ensuring all experts receive similar token volume), expert collapse (router stops using some experts), communication overhead for expert parallelism
- **Load balancing**: Auxiliary loss penalizes imbalanced expert assignment. Techniques include Z-loss, batch-prioritized routing, and expert choice routing (DeepSeek).
- **Sparse vs. dense**: A 7B-parameter dense model has a similar FLOP budget to a 47B MoE model with top-2 routing. MoE achieves much higher effective capacity per token.

Reference: [Mixture-of-Experts Explained (Hugging Face)](https://huggingface.co/blog/moe)

## Sub-Quadratic Attention and Alternatives

Standard attention is O(N²) in sequence length. Several approaches reduce this:

### Sliding Window Attention

Each token only attends to a fixed-size window of nearby tokens (e.g., 4K tokens). Used by Mistral and Gemma. Attention is O(N × W) where W is window size. Can be combined with global attention for special tokens.

### Ring Attention

Distributes attention computation across multiple devices by splitting the sequence into blocks that rotate (ring-style) through each device. Enables training with near-infinite context lengths on large GPU clusters. Each device computes partial attention for its block, then passes the block to the next device. Communication-overlapping hides the data transfer cost.

Reference: [Ring Attention with Blockwise Transformers](https://arxiv.org/abs/2307.10192)

### State-Space Models (Mamba)

Mamba (Gu & Dao, 2023) replaces attention with a structured state-space model that processes sequences in linear time O(N). It uses a selective scan algorithm — the state-transition matrix is input-dependent, allowing the model to selectively remember or forget information.

- Mamba-1: Selective state-space model, matches Transformer quality on language tasks at similar compute budgets
- Mamba-2 (2024): Simplified architecture using "structured state-space duality," 2-8x faster than Mamba-1
- Hybrid architectures (Jamba, Zamba): Interleave Mamba layers with attention layers for best of both worlds

Reference: [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)

### RWKV

RWKV combines the efficient training of Transformers (parallelizable) with the efficient inference of RNNs (constant memory). It uses a time-mixing mechanism that resembles attention but with O(N) complexity via a linear WKV (weighted key-value) recurrence.

### HyperAttention

HyperAttention (2024) uses locality-sensitive hashing (LSH) to identify the most relevant tokens for each query, computing attention only within clusters. Achieves near-O(N log N) complexity for long contexts with minimal quality loss.

### Comparison

| Architecture | Complexity | Quality vs Transformer | Best For |
|---|---|---|---|
| Sliding Window | O(N × W) | Similar (short context) | Long context with local patterns |
| Ring Attention | O(N² / P) | Identical | Very long contexts with many GPUs |
| Mamba | O(N) | Comparable | Efficient generation, long sequences |
| RWKV | O(N) | Slightly lower | Low-latency streaming |
| HyperAttention | ~O(N log N) | Slightly lower | Very long contexts on single GPU |
| Mamba-2 | O(N) | Comparable | GPU-efficient long context

## Foundational Paper

Attention Is All You Need
https://arxiv.org/abs/1706.03762

## Best Courses

### Stanford CS224N
https://web.stanford.edu/class/cs224n/

### Hugging Face NLP Course
https://huggingface.co/learn/nlp-course

### Andrej Karpathy's "Let's Build GPT from Scratch"
https://www.youtube.com/watch?v=kCc8FmEb1nY

## Practice Milestones

- Implement scaled dot-product attention from scratch in PyTorch
- Build a mini GPT-style transformer with <10M parameters and train it on a text corpus
- Visualise attention patterns for different heads and interpret what they learn
- Compare GPT-2, BERT, and T5 on the same task and explain the architecture differences
- Replicate a scaling laws experiment on a small scale

## Related Topics

- [Fine-Tuning](../04-llm-engineering/fine-tuning.md)
- [LLM Evaluation](../04-llm-engineering/evaluation.md)
- [LLMOps and AI Infrastructure](../07-ai-infrastructure/llmops.md)
