# AI Agent Patterns

## Why Agent Patterns Matter

Building a reliable agent requires structured design patterns, not just calling an LLM in a loop. These patterns address common failure modes: infinite loops, hallucinated tool calls, state loss, and poor error recovery.

## Model Context Protocol (MCP) Deep-Dive

MCP is the industry standard for connecting AI applications to tools and data sources.

### Architecture

```
Host (Claude, ChatGPT, your app)
  └── MCP Client
        ├── MCP Server A (database)
        ├── MCP Server B (search API)
        └── MCP Server C (file system)
```

### Key Concepts
- **Host** — the application that initiates connections (Claude Desktop, IDE, custom app)
- **Client** — a one-per-connection channel between host and server
- **Server** — provides context, tools, and prompts to clients

### Why MCP Won
- Donated to Linux Foundation AAIF (Dec 2025) — vendor-neutral
- 10,000+ active public servers
- 97M+ monthly SDK downloads
- Adoption: Claude, ChatGPT, Gemini, Copilot, Cursor, VS Code

### Implementation
- MCP servers expose **tools** (callable actions), **resources** (readable data), and **prompts** (templates)
- Transport: stdio (local) or HTTP+SSE (remote)
- Security: user consent required for tool execution

https://modelcontextprotocol.io/
https://github.com/modelcontextprotocol

## State Management

### Short-Term Memory
Conversation history within a session. Managed via context window — summarise or trim when approaching limits.

### Long-Term Memory
Persistent storage of user preferences, past interactions, and learned facts. Implemented via:
- Vector database (semantic retrieval of past memories)
- Key-value store (structured facts about users)
- SQL database (transactional state)

### Checkpointing
Save agent state at each step so it can recover from failures. LangGraph supports this natively.

## Multi-Agent Patterns

### Orchestrator-Worker
One agent coordinates, multiple workers execute. Best for parallelisable tasks.

### Peer-to-Peer
Agents communicate directly. Best for debate, negotiation, and collaborative reasoning.

### Supervisor
A supervisory agent monitors outputs, detects errors, and routes to the right worker or recovery path.

### Swarm
Many agents with simple behaviours produce complex emergent outcomes.

## Human-in-the-Loop (HITL)

Critical for production agents. Design patterns:

| Pattern | When | How |
|---|---|---|
| Pre-approval | Human must approve every tool call | High-risk operations (payments, deletes) |
| Post-review | Agent acts, human reviews | Moderate risk (emails, edits) |
| Escalation | Agent routes to human on uncertainty | Edge cases, low confidence |
| Override | Human can interrupt and redirect | Any multi-step workflow |

## Error Recovery

- **Retry with backoff** — transient failures (network, rate limits)
- **Fallback tool** — if primary tool fails, try an alternative
- **Graceful degradation** — report partial results instead of failing
- **Circuit breaker** — stop calling a failing tool after N errors
- **Human escalation** — hand off to a human when recovery fails

## Best Resources

### MCP Specification
https://spec.modelcontextprotocol.io/

### LangGraph Documentation
https://langchain-ai.github.io/langgraph/

### AI Agents Frameworks Compared (PE Collective)
https://pecollective.com/blog/ai-agent-frameworks-compared

### Awesome AI Agents 2026
https://github.com/caramaschiHG/awesome-ai-agents-2026

## Practice Milestones

- Implement an MCP server that exposes a database query tool
- Build a multi-agent system with orchestrator + 2 specialised workers
- Add human-in-the-loop approval for destructive tool calls
- Implement checkpoint recovery for a long-running agent workflow
- Measure agent reliability: success rate, error rate, human escalation rate

## Related Topics

- [AI Agents](agents.md)
- [LLM Evaluation](../04-llm-engineering/evaluation.md)
- [AI Observability](../07-ai-infrastructure/observability.md)
