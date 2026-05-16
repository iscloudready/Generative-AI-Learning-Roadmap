# Open Source AI Ecosystem

## Why It Matters

Open-source LLMs (Llama 3, Mistral, Qwen, DeepSeek, Gemma) now match or approach proprietary models on many benchmarks. Self-hosting gives you data privacy, full control over model behavior, predictable costs at scale, and the freedom to fine-tune, customize, and redistribute.

## Prerequisites

- Basic Python and command-line skills
- Understanding of model inference basics (from [LLM Engineering](../04-llm-engineering/tokenization.md))
- Familiarity with Docker is helpful but not required

## Core Concepts

### Model Hubs and Registries

- **Hugging Face Hub**: Central repository for 1M+ models, datasets, and Spaces. Provides the `transformers` library, `datasets`, `diffusers`, `trl`, and `PEFT`.
  - Models: filtered by task, license, language, hardware requirements
  - Spaces: hosted demos using Gradio or Streamlit
  - Inference API: free tier for testing, PRO tier for production
- **Ollama Library**: Curated collection of models in GGUF format, one-command pull and run
- **Model comparison**: Open LLM Leaderboard (Hugging Face), Chatbot Arena (LMSYS), Artificial Analysis

### Local Inference Engines

- **Ollama**: Simplest local LLM runner. Supports macOS, Linux, Windows. `ollama run llama3.2` starts a chat or OpenAI-compatible API server. Handles GPU acceleration via Metal (Apple) and CUDA (NVIDIA).
- **llama.cpp**: CPU-first inference in C/C++ with GPU offloading. Uses GGUF format. Powers Ollama under the hood. Supports K-quant (2-8 bit), speculative decoding, and batched inference.
- **LM Studio**: Desktop GUI for downloading and running models from Hugging Face. Best for non-developer experimentation. Built on llama.cpp.
- **vLLM**: Production-grade inference server with PagedAttention, continuous batching, tensor parallelism, and OpenAI-compatible API. See [LLMOps](../07-ai-infrastructure/llmops.md) for details.
- **Text Generation Inference (TGI)**: Hugging Face's optimized inference server with watermarking, safety filters, and message streaming.

### Model Formats and Quantization

- **GGUF**: llama.cpp format supporting 2-8 bit quantization. Most compatible with local tools.
- **AWQ**: Activation-aware weight quantization. Good balance of quality and speed.
- **GPTQ**: Post-training quantization for GPU inference. Standard for 4-bit.
- **Hugging Face (safetensors)**: Full-precision weights for training/fine-tuning. Can be quantized at load time.

### Tool Integration and Serving

- **LiteLLM**: OpenAI-compatible proxy that routes requests to 100+ providers (OpenAI, Anthropic, open-source via vLLM/Ollama). Handles fallback, rate limiting, load balancing.
- **Open WebUI**: Self-hosted ChatGPT-like interface. Supports Ollama and OpenAI-compatible backends. Includes RAG, web search, multi-user, and tool use.
- **LocalAI**: Drop-in OpenAI API replacement for local models. Docker-based, supports multiple backends.
- **LangChain / LlamaIndex**: Both support local models through LiteLLM, Ollama, and vLLM integrations.

### Community and Ecosystem

- **Open model families**: Llama 3.x (Meta), Mistral / Mixtral / Pixtral (Mistral AI), Qwen 2.5 (Alibaba), DeepSeek V3/R1 (DeepSeek), Gemma 2 (Google), Phi-4 (Microsoft), Command R+ (Cohere), DBRX (Databricks)
- **Open datasets**: FineWeb (Hugging Face), Dolly (Databricks), OpenAssistant, No Robots
- **Training ecosystems**: Axolotl, Unsloth, TRL, PEFT (see [Fine-Tuning](../04-llm-engineering/fine-tuning.md))

## Best Resources

- [Hugging Face](https://huggingface.co/) — Central hub for open-source models, datasets, and Spaces
- [Open WebUI](https://github.com/open-webui/open-webui) — Self-hosted chat interface for local and remote models
- [llama.cpp](https://github.com/ggerganov/llama.cpp) — LLM inference in C/C++ with GGUF format
- [LM Studio](https://lmstudio.ai/) — Desktop app for running local models
- [LiteLLM](https://github.com/BerriAI/litellm) — Model gateway and provider abstraction
- [Ollama](https://ollama.com/) — Simplest way to run local LLMs
- [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — Compare open-source models by benchmark scores
- [LMSYS Chatbot Arena](https://chat.lmsys.org/) — Crowd-sourced model quality ratings
- [Hugging Face Cookbook](https://huggingface.co/learn/cookbook) — Practical recipes for open-source model usage
- [vLLM vs llama.cpp Comparison (Red Hat)](https://developers.redhat.com/articles/2025/09/30/vllm-or-llamacpp-choosing-right-llm-inference-engine-your-use-case) — Choosing the right inference engine
- [LocalAI](https://localai.io/) — Drop-in OpenAI REST API replacement

## Practice Milestones

1. **Pull and chat with a local model**: Install Ollama, run `ollama pull llama3.2:3b`, and chat via terminal. Compare response quality with GPT-4o-mini.
2. **Serve a model via API**: Run `ollama serve` and call the OpenAI-compatible `/v1/chat/completions` endpoint from Python. Swap providers via LiteLLM config.
3. **Run Open WebUI with Ollama backend**: Deploy with Docker pointing to your local Ollama instance. Test RAG by uploading a PDF and asking questions.
4. **Quantize a model**: Download a model from Hugging Face, quantize it to GGUF Q4_K_M using `llama-quantize`, and run it via llama.cpp. Compare size and quality vs. the full model.
5. **Benchmark inference engines**: Run the same model (e.g., Llama 3.2 8B) on vLLM, Ollama, and llama.cpp. Measure tokens/second, memory usage, and TTFT (time to first token).
6. **Deploy with LiteLLM proxy**: Configure LiteLLM to route between Ollama (local), OpenAI, and Anthropic. Implement fallback: if OpenAI is down, route to local.
7. **Contribute to a community model**: Fine-tune an open model on a domain-specific dataset using Unsloth, upload to Hugging Face, and create a Space demo.

## Related Topics

- [Track 04: LLM Engineering](../04-llm-engineering/fine-tuning.md) — Fine-tuning open-source models
- [Track 07: LLMOps and Infrastructure](../07-ai-infrastructure/llmops.md) — Production serving with vLLM and KServe
- [Track 07: Observability](../07-ai-infrastructure/observability.md) — Monitoring self-hosted models
- [Track 09: Enterprise AI Governance](../09-enterprise-ai/governance.md) — Security and compliance for self-hosted AI
