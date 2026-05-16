# Prompt Engineering

## Why It Matters

Prompt engineering is the primary interface for controlling LLM behaviour. It is the cheapest and fastest way to improve output quality. Mastery of prompting patterns directly reduces cost (shorter prompts, fewer retries) and improves reliability.

## Core Techniques

### System Prompts
Define the model's persona, constraints, and output format upfront. Apply once per conversation.

### Few-Shot Prompting
Provide 2-5 examples of desired input-output pairs in the prompt. Effective for formatting and style.

### Chain-of-Thought (CoT)
Ask the model to reason step-by-step before answering. Dramatically improves accuracy on math, logic, and multi-step tasks.

https://arxiv.org/abs/2201.11903

### Structured Output
Request JSON, XML, or markdown output with a defined schema. Use tool calling / function calling for reliable structured extraction.

## Advanced Patterns

### Multi-Step Prompting
Decompose a complex task into a sequence of simpler prompts. Each step builds on the previous.

### Reflection / Self-Critique
Ask the model to evaluate its own output and revise it. Useful for writing, analysis, and code generation.

### Persona Assignment
Assign a specific role or expertise level. Changes tone, depth, and vocabulary of responses.

### Prompt Chaining
Route the output of one prompt as input to another. Implemented via LangChain or raw API calls.

## Cost-Quality Tradeoffs

| Strategy | Cost Impact | Quality Impact |
|---|---|---|
| Longer system prompt | Small one-time cost | High |
| Few-shot examples | Per-token, can add up | Medium-High |
| CoT reasoning | 2-5x more output tokens | High for reasoning |
| Multiple retries | Nx cost | High |
| Fine-tuning | High upfront, lower per-call | Highest for domain tasks |

## Best Resources

### OpenAI Prompt Engineering Guide
https://platform.openai.com/docs/guides/prompt-engineering

### Anthropic Prompt Engineering Docs
https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering

### DeepLearning.AI Prompt Engineering Course
https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/

### LangChain Prompt Templates
https://python.langchain.com/docs/concepts/prompt_templates/

## Practice Milestones

- Write a system prompt that produces consistent structured JSON output
- Compare zero-shot vs. few-shot accuracy on a classification task
- Implement a CoT prompt for a multi-step reasoning problem
- Build a prompt chain that summarises, extracts, and formats information
- Measure cost per 1k queries for different prompting strategies

## Related Topics

- [Fine-Tuning](fine-tuning.md)
- [Evaluation](evaluation.md)
- [Tools and Frameworks](../13-tools-and-frameworks/tools-and-frameworks.md)
