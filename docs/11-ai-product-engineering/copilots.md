# AI Product Engineering

## Why It Matters

Building an AI product requires more than calling an API. The difference between a demo and a shipped product lies in UX design, evaluation methodology, trust mechanisms, user research, and monetization strategy. Teams that treat AI as a UX problem — not just a model problem — ship products users adopt and rely on.

## Prerequisites

- Hands-on experience with at least one LLM API (OpenAI, Anthropic)
- Basic product thinking: user personas, success metrics, A/B testing
- Familiarity with evaluation concepts from [Track 04: Evaluation](../04-llm-engineering/evaluation.md)

## Core Concepts

### Copilot Design Patterns

- **Inline suggestions**: Model proposes completions as user types (e.g., GitHub Copilot, Cursor). High velocity, low user effort. Risk of inaccurate suggestions eroding trust.
- **Chat interface**: User asks questions, gets answers (e.g., ChatGPT, Claude). Most versatile. Requires context management and clear source attribution.
- **Agent loops**: Model takes actions, observes results, iterates (e.g., Devin, Copilot Workspace). Maximum autonomy. Needs robust error handling and user confirmation gates.
- **Hybrid patterns**: Chat + inline (e.g., Cursor, Windsurf), chat + agent (e.g., ChatGPT with tools). Most common in production.

### AI UX Guidelines

- **Microsoft HAX (Human-AI eXperience) Framework**: Guidelines for human-AI interaction including "Make clear what the system can do", "Show contextually relevant information", "Mitigate social biases"
- **Uncertainty communication**: Show confidence scores, offer alternatives, never overstate capability. A model that says "I'm not sure" is trusted more than one that confidently misleads.
- **Confirmation vs. auto-execute**: Destructive actions (delete, modify, spend money) require explicit user confirmation. Read-only actions can auto-execute with undo.
- **Gradual autonomy**: Start as suggest-only, introduce auto-execute as user trust builds. Let users configure autonomy level.
- **Attribution and citations**: Every claim should link to a source. For code, show diff preview before applying.

### Evaluation for Products

- **Offline evaluation**: Benchmark against labeled datasets before shipping. Use frameworks like DeepEval for assertion-based testing. Establish regression gates.
- **Online evaluation**: A/B test model versions in production. Measure task completion rate, user satisfaction (thumbs up/down), latency, and retention.
- **LLM-as-a-judge**: Use a strong model (GPT-4o, Claude 4) to evaluate output quality. Calibrate against human raters. Watch for judge model bias.
- **User telemetry**: Track what users accept, reject, edit, or reroll. These signals are more truthful than survey responses.
- **Continuous eval**: Monitor production quality with automated eval pipelines. Alert on drift. See [Observability](../07-ai-infrastructure/observability.md) for tooling.

### Trust and Safety

- **Human-in-the-loop (HITL)**: Design review layers for high-stakes outputs (medical, legal, financial). Use confidence thresholds to route to human reviewers.
- **Content safety**: Classify and filter harmful outputs. Use API safety filters (OpenAI Moderation, Azure Content Safety) plus custom guardrails (Guardrails AI, NVIDIA NeMo Guardrails).
- **Rate limiting and abuse prevention**: Per-user rate limits, authentication, usage monitoring.
- **Data privacy**: Never log prompt/response pairs without consent. Offer data retention controls. Consider local inference for sensitive data.

### Monetization Strategies

- **Usage-based pricing**: Pay-per-token or pay-per-call. Simple to understand but can surprise users. Common for API products.
- **Tiered features**: Free tier with basic capabilities, paid tier with advanced models, higher rate limits, or custom training.
- **Enterprise licensing**: Per-seat pricing with SLA guarantees, SSO, audit logs, on-premises deployment options.
- **Value-based pricing**: Price based on outcome (e.g., cost-per-candidate-screened, not per-API-call). Aligns incentives but harder to measure.
- **Freemium for adoption**: Free tier drives usage and data collection; convert heavy users to paid.

### User Research for AI

- **Identify high-value surfaces**: Where do users spend time on repetitive or knowledge-intensive tasks? These are prime copilot candidates.
- **Measure satisfaction**: Task success rate (TSR), net promoter score (NPS), time-to-task-completion, abandonment rate.
- **Failure analysis**: Categorize failures (wrong, irrelevant, unsafe, slow). Prioritize fixes by frequency and severity.
- **Expectation setting**: Users form mental models quickly. Clear onboarding, examples, and capability descriptions prevent disappointment.

## Best Resources

- [Microsoft AI Design Guidelines](https://learn.microsoft.com/en-us/ai/design/) — Official UX guidance for human-AI interaction
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview) — Official API for building copilot experiences
- [GitHub Copilot](https://github.com/features/copilot) — Industry-leading AI coding assistant
- [Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/) — Enterprise copilot ecosystem
- [DeepEval](https://github.com/confident-ai/deepeval) — LLM evaluation and testing framework
- [LangSmith](https://smith.langchain.com/) — LLM observability and evaluation platform
- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) — Best practices for prompt design
- [HAX Design Guidelines (Microsoft)](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/) — 18 human-AI interaction guidelines
- [Guardrails AI](https://github.com/guardrails-ai/guardrails) — Guardrails framework for LLM apps
- [NVIDIA NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) — Enterprise guardrails toolkit

## Practice Milestones

1. **Build a copilot prototype**: Choose a repetitive task (email drafting, code review, data analysis) and build a chat-based copilot. Add citation support.
2. **Implement A/B testing**: Ship two prompt variants to 50% of users each. Measure task completion rate and satisfaction. Run for one week.
3. **Design a trust mechanism**: Add confidence scores and uncertainty communication to your copilot. Run a user study comparing with/without confidence signals.
4. **Set up continuous evaluation**: Use DeepEval or LangSmith to create eval suites. Add a CI gate that blocks deployment if accuracy drops below a threshold.
5. **Monetize your copilot**: Add a usage tracking system. Design a tiered pricing model (free / pro / enterprise). Calculate break-even API costs.
6. **Handle failure modes**: Categorize 100 production failures from your copilot. Implement specific fixes for the top 3 categories. Measure improvement.
7. **Gradual autonomy feature**: Implement a slider from "suggest only" to "auto-execute". Track whether higher autonomy correlates with user retention.

## Related Topics

- [Track 04: LLM Engineering - Evaluation](../04-llm-engineering/evaluation.md) — Evaluation frameworks and metrics
- [Track 06: AI Agents](../06-ai-agents/agents.md) — Building autonomous agent experiences
- [Track 07: Observability](../07-ai-infrastructure/observability.md) — Production monitoring for AI products
- [Track 09: Enterprise AI Governance](../09-enterprise-ai/governance.md) — Safety, compliance, and responsible AI
- [Track 10: Multimodal AI](../10-multimodal-ai/multimodal.md) — Multimodal product experiences
