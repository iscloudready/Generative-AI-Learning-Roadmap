# AI Agents

## What Is an AI Agent?

An AI agent is an LLM-powered system that can perceive its environment, make decisions, and take actions using tools. Unlike a simple chat completion, agents maintain state, call external tools, and execute multi-step workflows.

## Core Capabilities

- **Tool calling** — invoke APIs, query databases, run code
- **State management** — maintain context across steps
- **Planning** — decompose goals into action sequences
- **Memory** — short-term (conversation) and long-term (external store)
- **Self-correction** — detect and recover from errors

## Agent Architecture Patterns

### ReAct (Reasoning + Acting)
Interleaves reasoning traces with tool calls. The model thinks "I need to do X" → calls tool → observes result → thinks again.

https://arxiv.org/abs/2210.03629

### Plan-and-Execute
The agent creates a plan upfront, then executes each step. Better for tasks where the overall structure is known in advance.

### Reflection
The agent evaluates its own outputs and revises them. Useful for writing, analysis, and code generation.

## Framework Comparison

| Framework | Paradigm | Best For |
|---|---|---|
| LangGraph | State machine | Complex production workflows |
| CrewAI | Role-based teams | Rapid multi-agent prototyping |
| AutoGen | Conversational | Multi-agent experiments |
| Semantic Kernel | Enterprise pipeline | Microsoft Azure shops |

### LangGraph
Graph-based orchestration with durable state, human-in-the-loop, and checkpointing.
https://github.com/langchain-ai/langgraph

### CrewAI
Role-based agents with defined goals, backstories, and tasks.
https://github.com/crewAIInc/crewAI

### AutoGen
Conversational multi-agent framework from Microsoft.
https://github.com/microsoft/autogen

### Semantic Kernel
Enterprise AI orchestration SDK with planners and connectors.
https://github.com/microsoft/semantic-kernel

## Model Context Protocol (MCP)

MCP is an open standard (donated to the Linux Foundation AAIF) for connecting AI agents to tools and data. It solves the NxM integration problem: one MCP server per tool instead of N custom integrations per tool.

https://modelcontextprotocol.io/

## Practice Milestones

- Build a ReAct agent that can search the web and calculate results
- Implement a LangGraph agent with human-in-the-loop approval
- Create an MCP server for a custom tool (e.g. database query, API)
- Add state persistence so the agent survives restarts
- Compare LangGraph vs. CrewAI on the same task

## Related Topics

- [AI Agent Patterns](agent-patterns.md)
- [Tool Calling and MCP](agent-patterns.md#model-context-protocol-mcp)
- [RAG Systems](../05-rag-systems/rag-overview.md)
