# AI for DevOps & SRE

## Why It Matters

Operations teams handle vast amounts of telemetry, logs, alerts, and incidents. AI can dramatically reduce mean time to detection (MTTD) and mean time to resolution (MTTR) by automating incident triage, root cause analysis, runbook generation, and anomaly detection. Every major observability platform now embeds AI features.

## Prerequisites

- Familiarity with basic DevOps concepts (CI/CD, containers, Kubernetes)
- Understanding of observability pillars: logs, metrics, traces
- Experience with at least one monitoring tool (Grafana, Datadog, Prometheus)

## Core Concepts

### AI for Incident Management

- **Incident detection**: ML models analyze metric and log patterns to detect anomalies before they trigger static thresholds. Tools: Datadog Watchdog, Grafana ML, Amazon DevOps Guru.
- **Incident triage and summarization**: LLMs ingest alert payloads, related logs, and change events to produce a natural language incident summary. Reduces cognitive load on on-call engineers.
- **Root cause analysis**: Graph-based RCA correlates service dependencies, recent deployments, and configuration changes to identify likely causes. Approaches: causal ML, knowledge graph traversal, LLM-based log analysis.
- **Postmortem generation**: LLMs draft postmortems from incident timelines, chat logs, and resolution notes. Saves hours of manual documentation.

### AI for Observability

- **Log analysis**: LLMs parse unstructured log lines, extract patterns, and flag anomalies. Tools: Grafana Loki + LLM plugins, Datadog Log Patterns, Elastic AI Assistant.
- **Metric correlation**: Automated discovery of which metrics move together and which precede failures. Time-series ML (Prophet, Kats) and changepoint detection.
- **Natural language querying**: Ask "What was our p99 latency in us-east-1 for the last 30 minutes?" and get the answer without writing PromQL. Tools: Grafana Explore with AI, Datadog AI Query.
- **Alert fatigue reduction**: ML deduplicates alerts, groups related ones into incidents, and suppresses noise. Track alert-to-incident ratio as a key metric.

### AI for Deployment and Operations

- **Deployment copilots**: Natural language Kubernetes management via Pulumi AI or GitHub Copilot for ops. Describe infrastructure in English, get manifests or CLI commands.
- **Runbook automation**: LLMs generate and execute runbooks from natural language requests. Validate commands before execution.
- **Capacity planning**: Forecast resource usage (CPU, memory, storage) using time-series ML. Tools: Kubernetes Vertical Pod Autoscaler (VPA), Cluster Autoscaler, custom forecasting models.
- **Cost optimization**: AI identifies undersized/oversized resources, suggests right-sizing, and predicts cost trends.

### Incident Response Workflow with AI

```
Alert → AI triage (severity, category, affected service)
  → AI context gathering (recent changes, related logs, metrics)
  → AI summary for on-call engineer
  → Human investigates, AI suggests runbooks
  → Resolution documented by AI postmortem
  → Feedback loop: was the triage accurate?
```

### Evaluation Metrics for AI Ops

- **Precision**: Of incidents flagged by AI, what fraction were real?
- **Recall**: Of real incidents, what fraction did AI catch?
- **MTTD reduction**: How much faster is detection with AI?
- **MTTR reduction**: How much faster is resolution?
- **Alert-to-incident ratio**: Lower is better — means AI is deduplicating effectively.
- **Engineer satisfaction**: Survey on-call engineers: is AI helping or adding noise?

## Best Resources

- [Grafana](https://grafana.com/) — Observability and monitoring platform with AI features
- [OpenTelemetry](https://opentelemetry.io/) — Industry standard for observability instrumentation
- [Langfuse](https://langfuse.com/) — LLM observability and tracing for AI-powered ops tools
- [Datadog AI](https://www.datadoghq.com/product/ai/) — AI-powered monitoring and incident management
- [PagerDuty AI](https://www.pagerduty.com/platform/ai/) — AI-powered incident response
- [Pulumi AI](https://www.pulumi.com/ai/) — Infrastructure automation with AI assistance
- [Kubernetes AI](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/) — Managing Kubernetes objects
- [AI for Incident Management (PagerDuty Blog)](https://www.pagerduty.com/blog/ai-incident-management/) — Best practices for AI in incident response
- [Grafana Loki + LLMs](https://grafana.com/blog/2024/10/15/ai-and-llms-in-grafana-loki/) — AI-powered log analysis with Grafana
- [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — Foundational SRE monitoring principles

## Practice Milestones

1. **Build an incident summarizer**: Ingest a sample PagerDuty alert with related logs. Use an LLM to produce a one-paragraph incident summary. Compare with human-written summaries.
2. **Anomaly detection on metrics**: Collect CPU/memory/latency metrics from a demo app. Train a simple anomaly detector (Isolation Forest, Twitter's AnomalyDetection). Trigger synthetic alerts.
3. **Natural language query for logs**: Connect an LLM to a Loki or Elasticsearch instance. Implement text-to-PromQL/LogQL with few-shot examples. Measure query accuracy.
4. **AI for deployment safety**: Build a copilot that reviews Kubernetes manifest changes and flags risky patterns (privileged containers, missing resource limits). Integrate into CI.
5. **Postmortem automation**: Take an incident timeline (alerts, chat transcripts, change logs) and prompt an LLM to draft a postmortem. Add a human review step.
6. **Triage accuracy experiment**: Run 100 historical alerts through an LLM-based triage system. Measure precision and recall vs. human triage. Iterate on prompt to improve.
7. **Cost optimization dashboard**: Use AI to analyze cloud spend (AWS Cost Explorer, GCP Billing). Build a dashboard that flags anomalies and suggests savings opportunities.

## Related Topics

- [Track 04: LLM Engineering - Prompt Engineering](../04-llm-engineering/prompt-engineering.md) — Designing prompts for ops use cases
- [Track 05: RAG Systems](../05-rag-systems/rag-overview.md) — RAG on runbooks, docs, and incident history
- [Track 06: AI Agents](../06-ai-agents/agents.md) — Autonomous ops agents with tool calling
- [Track 07: LLMOps and Infrastructure](../07-ai-infrastructure/llmops.md) — Deploying AI for ops workloads
- [Track 07: Observability](../07-ai-infrastructure/observability.md) — Observing the AI ops system itself
