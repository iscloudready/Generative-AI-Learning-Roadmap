# LLMOps & AI Infrastructure

## Critical Areas

Production AI systems require more than model quality. They need scalable serving, cost control, reliability, and observability.

- inference serving
- observability and monitoring
- GPU optimisation
- Kubernetes orchestration
- distributed inference
- cost management

## Inference Serving

### vLLM
High-throughput inference engine with PagedAttention, continuous batching, and Triton kernels. Supports quantization, tensor parallelism, and streaming.

Key features:
- PagedAttention — manages KV cache efficiently
- Continuous batching — dynamic request aggregation
- Disaggregated prefill/decode (v0.10+) — separate compute for prefill vs. decode phases
- OpenAI-compatible API

https://github.com/vllm-project/vllm

### Ollama
Simplest way to run local LLMs. Pull models from a library, serve via OpenAI-compatible API.

https://ollama.com/

### llama.cpp
CPU-first inference engine using GGUF format. Runs on laptops, edge devices, and servers without dedicated GPUs.

https://github.com/ggerganov/llama.cpp

## GPU Optimisation

| Technique | What It Does | Memory Saving |
|---|---|---|
| Quantisation (FP16→INT4) | Reduces model precision | 4x |
| Flash Attention 3 | Fused attention kernel | 2x+ |
| PagedAttention (vLLM) | Efficient KV cache management | Variable |
| Tensor parallelism | Split layers across GPUs | Scales with GPUs |
| Pipeline parallelism | Split layers by depth | Scales with GPUs |

### FlashAttention Deep-Dive

FlashAttention exploits the GPU memory hierarchy to compute exact attention without materializing N² matrices in HBM:

1. **Tiling**: Q, K, V are split into blocks that fit in fast on-chip SRAM (192KB per SM). Each block's partial softmax is computed incrementally.
2. **Recomputation**: During the backward pass, the full attention matrix is NOT stored. Instead, it's recomputed on-chip from Q, K, V blocks. This trades FLOPs for memory bandwidth — a favorable trade on modern GPUs.
3. **FlashAttention-2**: Better thread block scheduling reduces shared memory bank conflicts. ~2x over FA1.
4. **FlashAttention-3** (Hopper H100): Uses async WGMMA (warp-group matrix multiply-accumulate) and FP8 tensor cores. ~1.5-2x over FA2.

Reference: [FlashAttention Paper](https://arxiv.org/abs/2205.14135)

### Speculative Decoding

Standard autoregressive decoding is bandwidth-bound (each step reads the entire model from HBM for one token). Speculative decoding breaks this bottleneck:

1. A small draft model (e.g., 0.5B params) proposes K tokens cheaply
2. The large target model (e.g., 7B params) processes all K tokens in a single forward pass
3. A rejection sampling step accepts/rejects each draft token, preserving the exact target distribution
4. Typical speedup: 2-3x for 7B models with a 0.5B draft

Implementation options:
- **Two-model**: Separate draft and target models (requires loading both into memory)
- **Medusa**: Multiple heads on top of the target model predict future tokens simultaneously
- **Eagle**: Spectral draft heads trained to match target model's hidden states

Reference: [Speculative Decoding Paper](https://arxiv.org/abs/2211.17192)

### PagedAttention Internals

PagedAttention (vLLM) solves KV-cache fragmentation with OS-inspired memory management:

- **Physical vs. logical pages**: Each sequence's KV-cache is stored in logically contiguous blocks but physically non-contiguous pages
- **Block table**: Maps logical block IDs to physical page addresses (like a page table)
- **Copy-on-write**: During beam search, shared prefix blocks are physically shared until a divergence requires a copy
- **Preallocation-free**: Blocks are allocated on demand during the prefill phase, eliminating wasted memory from fixed-size allocation
- **GPU-CPU swap**: Idle sequences' KV-cache can be offloaded to CPU, reclaiming GPU memory for active sequences

### Fully Sharded Data Parallelism (FSDP)

FSDP shards model parameters, gradients, and optimizer states across GPUs, enabling training of models larger than single-GPU memory:

- **Full sharding (FSDP)**: Parameters are split across all GPUs. Each GPU fetches its needed parameters via all-gather before forward/backward. Reduces memory per GPU by ~N× where N is the number of GPUs.
- **Hybrid sharding (HSDP)**: Shards within a node, replicates across nodes. Balances communication overhead with memory savings.
- **Activation checkpointing**: Trade compute for memory — recompute activations during backward rather than storing them.
- **ZeRO stages**: ZeRO-1 (shard optimizers), ZeRO-2 (shard gradients), ZeRO-3 (shard parameters). FSDP implements ZeRO-3.

Reference: [FSDP Blog (Meta AI)](https://engineering.fb.com/2021/07/15/open-source/fsdp/)

## Orchestration

### KServe
Kubernetes-native model serving with auto-scaling, canary rollouts, and explainability.

https://kserve.github.io/kserve/

### Kubernetes for AI
GPU node pools, tolerations, and node affinity for scheduling inference workloads.

## Cost Management

- **Prompt caching** — cache common system prompts
- **Semantic caching** — cache near-identical queries using embeddings
- **Model routing** — LiteLLM routes simple queries to cheap models, complex queries to expensive ones
- **Prompt compression** — reduce token count without losing meaning
- **Batch processing** — prefill costs are amortised over many requests

## Best Resources

### NVIDIA Training
https://learn.nvidia.com/

### Enterprise Local LLM Deployment Guide
https://www.sitepoint.com/the-2026-definitive-guide-to-running-local-llms-in-production

### vLLM vs. llama.cpp Comparison (Red Hat)
https://developers.redhat.com/articles/2025/09/30/vllm-or-llamacpp-choosing-right-llm-inference-engine-your-use-case

### FlashAttention
https://arxiv.org/abs/2205.14135

### FSDP: Fully Sharded Data Parallelism
https://engineering.fb.com/2021/07/15/open-source/fsdp/

### Efficient Inference Deep-Dive
https://huyenchip.com/2023/10/11/building-llm-applications-for-production.html

## Practice Milestones

- Deploy a model with vLLM in a Docker container and benchmark throughput
- Configure continuous batching and measure latency under load
- Implement semantic caching and measure cost reduction
- Set up KServe with auto-scaling on Kubernetes
- Compare total cost of ownership: local model vs. API for 1M queries
- Profile FlashAttention vs. standard attention on a long-context task
- Implement a simple speculative decoding pipeline and measure speedup

## Related Topics

- [AI Observability](observability.md)
- [Efficient LLM Inference](../04-llm-engineering/efficient-inference.md)
- [Open Source AI Ecosystem](../08-open-source-ai/open-source-ai.md)
- [LLM Evaluation](../04-llm-engineering/evaluation.md)
