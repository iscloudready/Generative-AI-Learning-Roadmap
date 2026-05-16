# Multimodal AI

## Why It Matters

Most real-world data is inherently multimodal — text, images, audio, video, and documents arrive together. Modern frontier models (GPT-4V, Claude 3.5, Gemini 2, Grok Vision) natively process multiple modalities, enabling applications from document understanding to real-time voice conversations.

## Prerequisites

- Experience with text-based LLM APIs (OpenAI, Anthropic)
- Basic understanding of image/video data formats and compression
- Familiarity with speech/audio concepts (sampling rate, codecs) is helpful but not required

## Core Concepts

### Vision-Language Models (VLMs)

- **Architecture**: A vision encoder (e.g., CLIP ViT) projects images into the LLM's embedding space via a connector layer (Q-Former, MLP). The LLM then processes interleaved text and image tokens.
- **Leading models**: GPT-4V / GPT-4o (OpenAI), Claude 3.5 Sonnet / Claude 4 (Anthropic), Gemini 1.5 Pro / 2 Flash (Google), LLaVA-NeXT (open-source), Qwen-VL, Pixtral (Mistral)
- **Key capabilities**: Image captioning, visual question answering, OCR, chart/plot reading, document understanding, video frame analysis

### Speech and Audio

- **Speech-to-Text**: OpenAI Whisper (open-source, 97+ languages), Deepgram Nova (production-optimized), AssemblyAI
- **Text-to-Speech**: ElevenLabs (voice cloning, emotion control), OpenAI TTS API, Microsoft Azure Speech, Cartesia Sonic (low latency)
- **Real-time voice**: OpenAI Realtime API (WebSocket-based, GPT-4o Realtime), Gemini Live, voice活动 detection (VAD), WebRTC for streaming
- **Audio understanding**: AudioSet, CLAP (contrastive language-audio pretraining), music generation (Suno, Udio)

### Image and Video Generation

- **Image generation**: DALL-E 3 (OpenAI), Stable Diffusion 3 / SDXL (Stability AI), Midjourney, Firefly (Adobe), Imagen (Google)
- **Video generation**: Sora (OpenAI), Runway Gen-3 Alpha, Pika 2, Stable Video Diffusion, Kling (Kuaishou), Veo 2 (Google)
- **Common techniques**: Diffusion models (DDPM, latent diffusion), flow matching, CFG (classifier-free guidance), ControlNet for spatial conditioning

### Document Understanding and OCR

- Vision-based document parsing: LlamaParse, Marker, Azure Document Intelligence, Google Document AI
- OCR engines: Tesseract, PaddleOCR, AWS Textract
- Layout understanding: LayoutLM, YOLO for document structure, table extraction models

### Multimodal Architecture Patterns

- **CLIP-style contrastive learning**: Aligns image and text embeddings in a shared space via contrastive loss
- **Cross-attention fusion**: Image tokens attend to text tokens (and vice versa) in transformer layers
- **Q-Former (BLIP-2)**: A lightweight transformer that bridges a frozen vision encoder with a frozen LLM
- **Any-to-any models**: Gemini, ImageBind — single model processes text, image, audio, video, and 3D

### Vision Transformers (ViT)

ViT applies the standard Transformer architecture directly to image patches, treating each 16×16 patch as a "token":

- **Architecture**: Split image into fixed-size patches, linear-project each patch into an embedding, add positional embeddings, and feed through standard Transformer encoder layers.
- **Training**: Pre-train on large image datasets (ImageNet-21K, JFT-300M) with supervised classification. The [CLS] token's final representation is fed through a classification head.
- **Advantage over CNNs**: ViT can capture global image relationships from the first layer (CNNs build locality hierarchically). Scales better with data — ViT matches or exceeds CNN performance at sufficient scale.
- **Hybrid architectures**: Many modern vision models use a CNN backbone for patch embedding, then ViT layers for global reasoning.

Reference: [An Image is Worth 16x16 Words: Vision Transformers](https://arxiv.org/abs/2010.11929)

### VQ-VAE: Tokenizing Images for Generation

VQ-VAE (Vector Quantized Variational Autoencoder) bridges discrete tokens and continuous images, forming the foundation of DALL-E and other generative image models:

- **Encoder** compresses an image into a grid of latent vectors
- **Vector quantization**: Each latent vector is replaced by its nearest neighbor in a learned codebook (discrete tokens)
- **Decoder** reconstructs the image from quantized tokens
- **Autoregressive prior** (e.g., PixelCNN or Transformer) models the joint distribution over discrete token sequences — enabling generation by sampling from this prior and decoding
- **VQGAN**: Adds a discriminator (GAN loss) to improve perceptual quality of reconstructed images. Used by DALL-E and Parti.

VQ-VAE enables text-to-image generation by training a Transformer to predict visual tokens conditioned on text tokens.

Reference: [Neural Discrete Representation Learning (VQ-VAE)](https://arxiv.org/abs/1711.00937)

### Diffusion Model Theory

Diffusion models are the dominant paradigm for image and video generation (Stable Diffusion, DALL-E 3, Sora):

- **Forward process (diffusion)**: Gradually add Gaussian noise to an image over T timesteps until it becomes pure noise. This process is fixed (no learned parameters).
- **Reverse process (denoising)**: Learn a neural network (typically a UNet or Transformer) to predict the noise added at each step. Starting from random noise, iteratively denoise to produce a new image.
- **Training**: Sample a random timestep t, add noise to the image, train the model to predict the noise. Loss is simple MSE between predicted and actual noise.
- **Sampling (DDPM)**: Iteratively denoise for T steps (typically 50-1000). Each step predicts noise, removes a fraction of it, and adds a small amount of random noise for stochasticity.
- **DDIM**: Deterministic sampling that runs in 10-50 steps instead of 1000, using a non-Markovian forward process. Trade-off: faster sampling at slightly lower quality.
- **Latent diffusion (Stable Diffusion)**: Run the diffusion process in the compressed latent space of a VAE (not pixel space). Dramatically reduces computational cost (latent space is 8× smaller in each dimension).
- **Flow matching**: Alternative to diffusion that learns a continuous vector field (flow) from noise to data. Used by Stable Diffusion 3 and Sora. Enables faster training and sampling.
- **CFG (Classifier-Free Guidance)**: At sampling time, extrapolate the conditional prediction away from the unconditional prediction. Higher CFG scale = stronger conditioning adherence but less diversity.

Reference: [How Diffusion Models Work (DeepLearning.AI)](https://www.deeplearning.ai/short-courses/how-diffusion-models-work/)

### Audio Tokenization and Generation

Audio models process waveforms by tokenizing them into discrete or continuous representations:

- **Audio codecs**: Encode/decode audio to discrete tokens. EnCodec (Meta), SoundStream (Google), DAC (Descript). Operate at low bitrates (e.g., 6 kbps vs. 256 kbps for raw audio).
- **AudioLM (Google)**: Treats audio as a language modeling task — generates speech by autoregressively predicting audio tokens. Uses multiple token streams (semantic + acoustic).
- **Music generation**: Suno, Udio use diffusion or autoregressive models trained on music audio tokens. Text-to-music: describe style, genre, instruments.
- **Speech generation**: Bark (Suno), Voicebox (Meta), CosVoice (Alibaba). Zero-shot voice cloning, emotion control, prosody variation.
- **Text-to-speech advances**: ElevenLabs, Cartesia Sonic, OpenAI TTS. Low latency (200ms), natural prosody, real-time streaming via WebSocket.

### GANs for Generation

While diffusion models dominate image generation, GANs remain important for real-time and interactive applications:

- **Architecture**: Generator produces fake images; discriminator tries to distinguish real from fake. Training is a minimax game between generator and discriminator.
- **Mode collapse**: Generator learns to produce only a few realistic-looking outputs. Mitigated by mini-batch discrimination, spectral normalization, and Wasserstein loss (WGAN).
- **Conditional GANs**: Both generator and discriminator receive conditioning information (class label, text embedding). Used for text-to-image (StackGAN, AttnGAN), image-to-image (Pix2Pix), and super-resolution (SRGAN).
- **StyleGAN (NVIDIA)**: Maps latent codes through a mapping network before feeding to the generator. Enables style mixing and intuitive latent-space editing. Used for high-quality face synthesis.
- **VQGAN-CLIP**: Combines VQGAN (generates images from token sequences) with CLIP (evaluates text-image alignment). Enables text-to-image generation without explicit text-image training data.

## Best Resources

- [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision) — Official multimodal image understanding docs
- [OpenAI Whisper](https://github.com/openai/whisper) — Open-source speech recognition model
- [ElevenLabs](https://elevenlabs.io/) — Production voice AI platform
- [CLIP Paper (Learning Transferable Visual Models)](https://arxiv.org/abs/2103.00020) — Foundational vision-language alignment
- [LLaVA Paper (Visual Instruction Tuning)](https://arxiv.org/abs/2304.08485) — Open-source VLM architecture
- [Stable Diffusion 3 Paper](https://arxiv.org/abs/2403.03206) — Scaling rectified flow transformers for high-resolution image synthesis
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) — WebSocket-based voice and text conversations
- [Runway Gen-3 Alpha](https://runwayml.com/) — Production video generation platform
- [Whisper: Robust Speech Recognition via Large-Scale Weak Supervision](https://arxiv.org/abs/2212.04356) — Foundational speech-to-text paper
- [MMLU-Pro Benchmark](https://huggingface.co/spaces/mmlu/pro) — Multi-modal evaluation benchmark
- [Advances in Multimodal LLMs Survey](https://arxiv.org/abs/2401.13601) — Comprehensive survey of MM-LLM techniques
- [How Diffusion Models Work (DeepLearning.AI)](https://www.deeplearning.ai/short-courses/how-diffusion-models-work/) — Hands-on diffusion fundamentals
- [Understanding VQ-VAE (ML at Berkeley)](https://ml.berkeley.edu/blog/posts/vq-vae/) — Explainer on VQ-VAE, foundation of image generation
- [ViT Paper (An Image is Worth 16x16 Words)](https://arxiv.org/abs/2010.11929) — Vision Transformers applied to image recognition
- [StyleGAN 3 (NVIDIA)](https://arxiv.org/abs/2106.12423) — Alias-free generative adversarial networks

## Practice Milestones

1. **Build an image captioning app**: Use GPT-4V or LLaVA to generate captions for user-uploaded images. Add streaming responses.
2. **Create a voice assistant**: Use Whisper for STT, an LLM for response generation, and ElevenLabs for TTS. Implement voice activity detection for turn-taking.
3. **Document parser**: Build a system that extracts text and tables from PDF invoices using a VLM + OCR. Compare accuracy with pure OCR approaches.
4. **Real-time video analysis**: Stream webcam frames to a VLM every second and ask questions about what's happening. Handle rate limits.
5. **Multi-turn vision chat**: Implement a chat interface where users can upload images mid-conversation and ask follow-up questions referencing previous images.
6. **Compare VLM accuracy**: Evaluate GPT-4o, Claude 3.5 Sonnet, and Gemini 2 on a visual reasoning benchmark (MMMU, MathVista). Report accuracy and latency.

## Related Topics

- [Track 04: LLM Engineering](../04-llm-engineering/tokenization.md) — Tokenization across modalities
- [Track 05: RAG Systems](../05-rag-systems/rag-overview.md) — Multi-modal RAG with image retrieval
- [Track 06: AI Agents](../06-ai-agents/agents.md) — Agents that process images, audio, and video
- [Track 11: AI Product Engineering](copilots.md) — Building multimodal user-facing products
