# Link and Content Quality Audit

Audit date: 2026-05-13

## Scope

The audit scanned Markdown files in the repository and found external URLs
across the root README, roadmap overview, and docs folder.

## Summary

All known short links (`lnkd.in`, `t.co`) have been replaced with canonical
URLs. The 10 stale or bad URLs identified in the original audit have been
fixed. Remaining `youtu.be` links are YouTube's canonical short domain and
are considered stable.

## Original Findings (Historical)

The initial audit (2026-05-12) found these issues, all now resolved:

| Finding | Count | Status |
|---|---:|---|
| Unique external URLs | 147 | Ongoing maintenance. |
| Shortened URLs (`lnkd.in`, `t.co`) | ~27 | Replaced with canonical URLs. |
| Confirmed bad or stale URLs | 10 | All fixed in source. |

### Stale URLs Fixed

| URL | Issue | Resolution |
|---|---|---|
| `https://example.com` | Placeholder. | Replaced with arXiv link. |
| `https://kserve.github.io/website/latest/` | 404. | Updated to `kserve.github.io/kserve/`. |
| `https://www.kaggle.com/code/...langchain-chatbots-memory` | 404. | Replaced with official LangChain docs. |
| `https://www.deeplearning.ai/generative-ai-with-llms/` | Stale. | Updated to `/courses/` path. |
| `https://www.deeplearning.ai/neural-networks-and-deep-learning/` | Stale. | Replaced with Coursera URL. |
| `https://www.deeplearning.ai/structuring-ml-projects/` | Stale. | Replaced with Coursera URL. |
| `https://www.deeplearning.ai/improving-deep-neural-networks/` | Stale. | Replaced with Coursera URL. |
| `https://www.deeplearning.ai/nlp-specialization/` | Stale. | Updated to current path. |
| `https://www.deeplearning.ai/generative-adversarial-networks/` | Stale. | Updated to current path. |
| `https://www.deeplearning.ai/ai-ethics/` | Removed. | Replaced with AI for Good course. |

## Quality Assessment

The roadmap already has useful breadth, but it should become more selective.
More content is helpful only if it is genuine, current, and traceable to a
trusted source. Adding more links without metadata would make the roadmap harder
to use.

High-quality additions should prioritize:

- official documentation
- original research papers
- university courses
- established open-source projects
- hands-on labs with clear prerequisites
- production case studies with named sources

Avoid adding:

- social short links as primary references
- duplicated videos across multiple sections
- placeholder links
- resources without provider, difficulty, or learning outcome
- content that is only marketing material

## Recommended Data Model

New resources should include:

- title
- provider
- type
- URL
- difficulty
- prerequisite
- learning outcome
- quality reason
- last checked date

The new `data/resources.json` file starts this direction for the GitHub Pages
site. It should become the canonical curated data layer, while the README can
remain a broad catalog.

