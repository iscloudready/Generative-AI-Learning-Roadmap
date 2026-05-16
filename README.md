<p align="center">
  <img src="assets/hero-banner.svg" alt="Generative AI Learning Roadmap" width="100%">
</p>

<p align="center">
  <a href="index.html"><img src="https://img.shields.io/badge/Launch-Interactive%20App-0b7a75?style=for-the-badge&logo=html5" alt="Launch App"></a>
  <a href="docs/README.md"><img src="https://img.shields.io/badge/Docs-Explore%20Guides-075d59?style=for-the-badge&logo=readthedocs" alt="Docs"></a>
  <a href="docs/contribution-guide.md"><img src="https://img.shields.io/badge/Contributions-Welcome-b57817?style=for-the-badge&logo=github" alt="Contributions Welcome"></a>
  <br>
  <img src="https://img.shields.io/badge/Phases-4-2dd4bf?style=flat-square" alt="4 Phases">
  <img src="https://img.shields.io/badge/Tracks-16-0b7a75?style=flat-square" alt="16 Tracks">
  <img src="https://img.shields.io/badge/Resources-200%2B-075d59?style=flat-square" alt="200+ Resources">
  <img src="https://img.shields.io/badge/Updated-2026-fbbf24?style=flat-square" alt="Updated 2026">
</p>

---

A curated, phase-based roadmap for mastering generative AI -- from mathematical foundations to production systems. Every resource has been hand-picked for quality and organized so you know exactly what to learn next.

## Features

- **Phase-based progression** -- 4 color-coded phases, 16 tracks, each building on the last
- **Level filtering** -- Filter by Beginner, Intermediate, or Advanced to find your entry point
- **Integrated doc viewer** -- Click any doc link to read guides in a slide-over sidebar with prev/next navigation
- **Progress tracking** -- Check off resources as you complete them; all data is saved to `localStorage`
- **Dashboard** -- See tracks started, completion percentage, and resume your last-accessed track
- **Dark mode** -- Automatic system preference detection with manual toggle
- **Responsive** -- Works on desktop, tablet, and mobile

## Quick start

1. Open the **[interactive app](index.html)** in your browser (works best served via HTTP -- e.g. `npx serve` or `python -m http.server`)
2. Browse the four phases, expand a phase to see its tracks
3. Click a **track card** to reveal its resources
4. Use the **level filter** (All / Beginner / Intermediate / Advanced) to narrow down
5. Click **doc links** to read guides in the built-in viewer
6. Check off resources as you complete them

## The four phases

| Phase | Focus | Tracks |
|---|---|---|
| **1 -- Foundations** | Mathematics, ML basics, deep learning, transformers | 4 |
| **2 -- Core LLM Engineering** | LLMs, RAG, AI agents | 3 |
| **3 -- Production & Infrastructure** | LLMOps, open-source AI, enterprise governance | 3 |
| **4 -- Applied AI** | Multimodal, product engineering, use cases, tools | 4 |
| **Reasoning & Coding** | Reasoning models, test-time compute, coding AI tools | 2 |

## Preview

```
Phase 1: Foundations           Phase 2: Core LLM Engineering
  [Introduction] ▸ 7 resources   [LLM Engineering] ▸ 28 resources
  [Scientific Foundations] ▸ 13  [RAG Systems] ▸ 16
  [Machine Learning] ▸ 24        [AI Agents] ▸ 16
  [Deep Learning] ▸ 23

Phase 3: Production            Phase 4: Applied AI
  [LLMOps & Infrastructure] ▸14  [Multimodal AI] ▸ 16
  [Open Source AI Ecosystem] ▸10 [AI Product Engineering] ▸ 9
  [Enterprise AI Governance] ▸12 [Real-World Use Cases] ▸ 11
                                  [Tools & Frameworks] ▸ 18

+ Reasoning Models (Advanced, 8) | Coding AI & Dev Tools (Intermediate, 8)
```

## Structure

```
data/
  resources.js          # Single source of truth for all tracks and resources
assets/
  app.js                # Application logic (sidebar viewer, progress, filters, theme)
  styles.css            # Styles with light + dark theme support
  hero-banner.svg       # README header image
docs/                   # Deep-dive guides for each track
index.html              # Interactive web app
```

## Contributing

Contributions are welcome -- whether it is adding a resource, fixing a link, or improving the documentation.

See the [contribution guide](docs/contribution-guide.md) to get started.

---

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-17211b?style=flat-square" alt="MIT License">
</p>
