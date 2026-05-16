# Efficient LLM Inference

## Why It Matters

LLM inference cost (latency, throughput, memory) directly determines what products are feasible. Advances in efficient inference — FlashAttention, speculative decoding, quantization, KV-cache optimization — have enabled models to serve 10-100x more tokens per second on the same hardware, making real-time applications economically viable.

## Prerequisites

- Understanding of transformer architecture (see [Transformers](../03-deep-learning-transformers/transformers.md))
- Familiarity with GPU memory hierarchy (HBM, SRAM)
- Basic quantization concepts (FP16, INT8, INT4)

## Core Concepts

### FlashAttention

FlashAttention (Dao et al., 2022) is the most impactful inference/training efficiency improvement since the original Transformer. It exploits the GPU memory hierarchy to compute exact attention without materializing the full N×N attention matrix in HBM.

**Key insight**: The standard attention formula `softmax(QK^T)V` writes an N×N matrix to slow HBM, then reads it back. FlashAttention tiles the computation over blocks that fit in fast SRAM, recomputing the attention on-chip during the backward pass to avoid storing intermediates.

- **FlashAttention-1**: 2-4x speedup, exact attention, no approximation
- **FlashAttention-2**: Better thread block scheduling, ~2x over FA1, covers forwards + backwards
- **FlashAttention-3** (Hopper GPUs): Async WGMMA instructions, FP8 support, ~1.5-2x over FA2

Reference: [FlashAttention: Fast and Memory-Efficient Exact Attention](https://arxiv.org/abs/2205.14135)

### PagedAttention

Standard KV-cache allocation wastes memory through internal fragmentation (pre-allocated for max sequence length) and external fragmentation (variable-length sequences competing for contiguous blocks).

**PagedAttention** (Kwon et al., 2023), used by vLLM, manages KV-cache in fixed-size blocks (pages), inspired by virtual memory in operating systems:

- Blocks are allocated on demand as tokens are generated
- Non-contiguous physical pages are mapped to a contiguous logical address space
- Copy-on-write enables efficient beam search and parallel sampling
- Result: near-zero KV-cache waste, enabling 2-4x higher throughput

Reference: [Efficient Memory Management for LLM Serving with PagedAttention](https://arxiv.org/abs/2309.06180)

### Speculative Decoding

Standard autoregressive decoding generates one token at a time, underutilizing GPU parallelism. Speculative decoding uses a small, fast "draft" model to propose K tokens, which the large "target" model verifies in parallel. If all K tokens are accepted, throughput increases up to K×. If some are rejected, no quality is lost — the output distribution is identical to the target model.

**Key requirements**:
- Draft model should run 5-10x faster than target model
- Acceptance rate depends on draft-target agreement (typically 60-90% for well-matched pairs)
- No quality degradation — the verification step guarantees exact target-model distribution

Practical implementations: Medusa (multiple draft heads on the target model itself), Eagle (spectral draft heads), and standard two-model speculative decoding.

Reference: [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)

### Quantization

Reducing model precision from FP16 to lower bit-widths reduces memory and increases throughput:

| Format | Bits/Param | Memory vs FP16 | Quality Impact | Hardware |
|--------|-----------|----------------|----------------|----------|
| FP8 | 8 | 50% | Minimal | H100, MI300X |
| INT8 (W8A8) | 8 | 50% | Minimal | T4+, L4+ |
| INT4 (GPTQ/AWQ) | 4 | 25% | Slight | All GPUs |
| NF4 (QLoRA) | 4 | 25% | Slight | CPU/GPU |
| GGUF Q4_K_M | ~4.5 | 28% | Slight | CPU (llama.cpp) |
| GGUF Q2_K | ~2.6 | 16% | Noticeable | CPU (llama.cpp) |

- **GPTQ**: Post-training quantization, requires calibration dataset
- **AWQ**: Activation-aware weight quantization, better quality than GPTQ at same bit-width
- **GGUF**: llama.cpp format, supports many quantization levels (2-8 bit), CPU-optimized
- **FP8 training**: Native on H100, enables faster training with less memory

### KV-Cache Optimization

Beyond PagedAttention, additional KV-cache techniques:

- **KV-cache quantization**: Quantize KV-cache to INT8 or FP8 (reduces memory 2x)
- **Sliding window cache**: Only keep recent tokens in cache (Mistral, StreamingLLM)
- **Prefix caching**: Cache KV for common prefixes across requests (prompt caching)
- **Window attention + compression**: Gemma 2, LongNet — compress old tokens into summary

### Continuous Batching

Instead of waiting for a complete batch to finish before scheduling new requests, continuous batching adds/removes sequences dynamically. vLLM's iteration-level scheduling adds new sequences after each decode step, maximizing GPU utilization.

Reference: [Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu)

## Best Resources

- [FlashAttention Paper](https://arxiv.org/abs/2205.14135) — IO-aware exact attention
- [Efficiently Serving LLMs (DeepLearning.AI)](https://www.deeplearning.ai/short-courses/efficiently-serving-llms/) — Practical inference optimization course
- [PagedAttention Paper](https://arxiv.org/abs/2309.06180) — vLLM's KV-cache management
- [Speculative Decoding Paper](https://arxiv.org/abs/2211.17192) — Draft-verify inference acceleration
- [vLLM Documentation](https://docs.vllm.ai/) — Production inference engine
- [Quantization Fundamentals with Hugging Face](https://www.deeplearning.ai/short-courses/quantization-fundamentals-with-hugging-face/) — Quantization theory and practice
- [Building LLM Applications for Production (Chip Huyen)](https://huyenchip.com/2023/10/11/building-llm-applications-for-production.html) — Production LLM considerations
- [FlashAttention-3: Fast and Accurate Attention with Async WGMMA](https://arxiv.org/abs/2407.08608) — Hopper GPU optimizations

## Practice Milestones

1. **Measure attention memory**: Implement standard attention and FlashAttention in PyTorch. Compare memory usage for sequence lengths 512, 1024, 2048, 4096.
2. **Profile vLLM**: Deploy a model with vLLM and benchmark tokens/second vs. Hugging Face default implementation. Vary batch size and sequence length.
3. **Compare quantization methods**: Quantize the same model with GPTQ, AWQ, and GGUF Q4_K_M. Measure perplexity difference and tokens/second on CPU and GPU.
4. **Implement speculative decoding**: Use a small draft model (e.g., 0.5B) with a large target model (e.g., 7B). Measure acceptance rate and speedup.
5. **KV-cache tradeoff analysis**: Compare standard KV-cache, sliding window, and quantized KV-cache. Measure memory savings vs. quality impact on long-context tasks.
6. **End-to-end cost model**: Build a cost spreadsheet comparing FP16, INT8, and INT4 serving for 1M daily queries. Include GPU hours, latency SLAs, and quality requirements.

## Related Topics

- [LLMOps and Infrastructure](../07-ai-infrastructure/llmops.md) — Production serving with vLLM and KServe
- [Fine-Tuning](../04-llm-engineering/fine-tuning.md) — QLoRA for memory-efficient fine-tuning
- [Open Source AI Ecosystem](../08-open-source-ai/open-source-ai.md) — Local inference engines (llama.cpp, Ollama)
- [Observability](../07-ai-infrastructure/observability.md) — Monitoring inference performance
