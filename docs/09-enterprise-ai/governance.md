# Enterprise AI Governance

## Core Areas

- AI governance frameworks
- regulatory compliance
- privacy and data protection
- security architecture
- responsible AI

## Governance Frameworks

### NIST AI Risk Management Framework (RMF)
The US standard for managing AI risk. Built on four core functions:

1. **Govern** — establish policies, roles, and accountability
2. **Map** — understand context, risks, and potential impacts
3. **Measure** — evaluate performance, safety, and fairness
4. **Manage** — implement controls and monitor continuously

https://www.nist.gov/itl/ai-risk-management-framework

### ISO/IEC 42001
First international standard for AI management systems. Provides a certifiable framework for AI governance.

### EU AI Act
Now in force. Mandates comprehensive testing for high-risk AI systems, transparency requirements, and human oversight. Non-compliance can result in fines up to 7% of global revenue.

### Responsible AI Guides (Big Tech)
- **Microsoft Responsible AI** — https://www.microsoft.com/en-us/ai/responsible-ai
- **Google AI Principles** — https://ai.google/responsibility/principles/
- **Anthropic Safety** — https://www.anthropic.com/safety

## Security: OWASP Top 10 for LLM Applications

| Rank | Vulnerability |
|---|---|
| 1 | Prompt Injection |
| 2 | Insecure Output Handling |
| 3 | Training Data Poisoning |
| 4 | Model Denial of Service |
| 5 | Supply Chain Vulnerabilities |
| 6 | Sensitive Information Disclosure |
| 7 | Insecure Plugin Design |
| 8 | Excessive Agency |
| 9 | Overreliance |
| 10 | Model Theft |

### OWASP Top 10 for Agentic Applications (Dec 2025)
New category addressing unique risks of autonomous agents:
- Unauthorised tool invocation
- Goal misalignment
- Memory poisoning
- Multi-agent collusion

https://owasp.org/www-project-top-10-for-large-language-model-applications/

## Red Teaming

Red teaming has matured from optional practice to regulatory requirement. Structured approaches include:

- **Manual red teaming** — human testers probe for failures
- **Automated red teaming** — LLM-based agents generate adversarial inputs
- **Benchmark-based** — standardised safety benchmarks (MMLU safety, TruthfulQA)
- **Continuous red teaming** — ongoing testing integrated into CI/CD

## Mechanistic Interpretability

Mechanistic interpretability (MI) aims to reverse-engineer the internal computations of neural networks into human-understandable algorithms. Unlike behavioral testing (black-box), MI opens the model and studies its circuits.

### Key Concepts

- **Features**: Directions in activation space that represent concepts (e.g., "the letter 'h'", "negation", "color red"). Features are often discovered via sparse autoencoders.
- **Circuits**: Small, interpretable subgraphs of model computations responsible for specific behaviors (e.g., the indirect-object-identification circuit in GPT-2).
- **Superposition**: Models represent more features than they have dimensions by encoding them in overlapping, almost-orthogonal directions. This makes features hard to disentangle.
- **Sparse Autoencoders (SAEs)**: Train autoencoders with L1 sparsity on model activations to discover monosemantic features. Used successfully on GPT-2 small and Claude Sonnet (Anthropic, 2024).
- **Activation Steering**: Modify model behavior at inference time by adding or subtracting feature directions in activation space. Can steer away from harmful outputs without fine-tuning.
- **Logit Lens / Tuned Lens**: Techniques to read next-token predictions from intermediate layers, revealing how predictions evolve through the model depth.

### Why MI Matters for Governance

- Detect dangerous capabilities (deception, situational awareness) before they manifest in behavior
- Verify that safety training (RLHF) actually modifies model internals rather than just teaching superficial compliance
- Provide evidence for regulatory audits that a model's internal representations align with declared safety objectives

Reference: [Mechanistic Interpretability Glossary (Neel Nanda)](https://www.neelnanda.io/mechanistic-interpretability/glossary)

## Constitutional AI

Constitutional AI (CAI), developed by Anthropic, trains models to be harmless using a set of written principles (a "constitution") rather than extensive human feedback. Two phases:

1. **Supervised phase**: The model generates responses to harmful prompts, then revises them according to constitutional principles (e.g., "Choose the response that is most helpful, harmless, and honest"). Fine-tune on the revised responses.
2. **RL phase**: Use the constitution to generate a preference dataset: for each prompt, compare the model's response against a critique+revision generated according to the constitution. Train with DPO or RLHF on these preferences.

Key difference from standard RLHF: no human labelers need to write preference judgments — the constitution provides automated critique. This enables rapid iteration and unambiguous safety criteria.

Reference: [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073)

## Representation Engineering

Representation engineering (RepE) controls model behavior by manipulating internal representations rather than fine-tuning or prompting:

- **Control vectors**: Directions in activation space that correspond to high-level behavior (honesty, sycophancy, refusal). Adding a refusal vector increases refusal rate; subtracting it reduces refusal.
- **Contrast-consistent search**: Identify control vectors by finding directions that consistently distinguish pairs of contrastive inputs (e.g., honest vs. dishonest completions).
- **Advantage over prompting**: Control vectors work even when the model is prompted to behave otherwise, providing a stronger guarantee than instruction-following.

Reference: [Representation Engineering: A Top-Down Approach to AI Transparency](https://arxiv.org/abs/2310.01405)

## Best Resources

### AI Security Standards (SentinelOne)
https://www.sentinelone.com/cybersecurity-101/data-and-ai/ai-security-standards/

### LLM Security Guide 2026
https://github.com/requie/LLMSecurityGuide

### AI Compliance Checklist (EU AI Act + NIST + OWASP)
https://guardion.ai/blog/ai-compliance-checklist-2026

### Understanding Responsible AI (Google Cloud)
https://www.cloudskillsboost.google/course_templates/554

### Mechanistic Interpretability Glossary (Neel Nanda)
https://www.neelnanda.io/mechanistic-interpretability/glossary

### Constitutional AI: Harmlessness from AI Feedback
https://arxiv.org/abs/2212.08073

## Practice Milestones

- Run an automated red-teaming exercise against an LLM application
- Create a governance checklist mapping NIST AI RMF to technical controls
- Implement prompt injection detection and mitigation
- Document a risk assessment for a sample AI feature using the EU AI Act framework
- Build a safety evaluation suite that runs on every deployment
- Train a sparse autoencoder on a small model's activations and interpret discovered features
- Implement activation steering to modify model behavior without fine-tuning
- Audit an RLHF-trained model using CAI principles and compare behavior

## Related Topics

- [LLM Evaluation](../04-llm-engineering/evaluation.md)
- [AI Product Engineering](../11-ai-product-engineering/copilots.md)
- [AI Observability](../07-ai-infrastructure/observability.md)
