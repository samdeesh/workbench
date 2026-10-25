# 📐 Architecture & Modularity Roadmap

> **Status:** Active Reference / Architectural Evolution Note  
> **Target Subdomain:** [`bench.foundry.blog`](https://bench.foundry.blog/)  
> **Hosting Platform:** Cloudflare Pages (`workbench` project)

---

## 📌 Executive Summary & Architectural Note

This document serves as an intentional record that the initial repository layout and deployment mechanism were implemented as a pragmatic **Phase 1 foundation** for the first interactive companion demo (*Level 2–4 AI-Native UX*). 

While functional, secure, and fast, **the current setup is recognized as an early transitional structure rather than the final modular ideal**. In subsequent demos (e.g. *Generative UI*, *Ambient Multi-Agent Orchestration*), the repository architecture will undergo deliberate modular refactoring.

---

## 🔍 Phase 1 Review: Current State & Limitations

```
.
├── index.html                  # Catalog Home
├── ai-native-ux/               # Module 1 Route (/ai-native-ux/)
│   └── index.html
├── styles/
│   └── main.css                # Global monolithic stylesheet
├── js/
│   └── app.js                  # Monolithic controller handling search, HITL, autopilot
├── scripts/
│   ├── capture-showcase.mjs    # Puppeteer visual verification script
│   └── upload-assets.mjs       # Ad-hoc Direct Upload script for Cloudflare Pages
└── vite.config.js              # Multi-page input definitions
```

### Known Architectural Limitations:
1. **Coupled Application Controller (`js/app.js`):**
   - Current logic for intent-based search routing, Level 3 HITL approval triggers, Level 4 autopilot timeline rendering, and audio waveform simulation all reside within a single file.
   - *Drawback:* Future demo modules cannot easily import isolated subsystems without dragging in unrelated state.

2. **Monolithic Stylesheet (`styles/main.css`):**
   - Design tokens, global resets, enterprise card styles, and demo-specific widgets (e.g. autopilot timeline, approval modals) exist in one ~800-line CSS file.
   - *Drawback:* Lacks strict CSS encapsulation or component token scoping.

3. **Manual / Scripted Asset Deployment (`scripts/upload-assets.mjs`):**
   - Cloudflare Pages deployments currently utilize an ad-hoc Direct Upload script calling `/pages/assets/upload` and creating deployments via API.
   - *Drawback:* Lacks automated Git CI/CD orchestration on pull requests and branch merges.

---

## 🚀 Phase 2 Target: Modular Architecture for Future Demos

For upcoming articles and interactive modules, the repository will transition to the following modular patterns:

```
workbench/
├── packages/ or src/
│   ├── core/                    # Shared core runtime & design primitives
│   │   ├── tokens.css           # Material & Foundry token system
│   │   ├── components/          # Reusable web components (Waveform, HITL card, Pill)
│   │   └── telemetry/           # Shared event bus & metrics logger
│   │
│   ├── modules/                 # Self-contained demo domains
│   │   ├── ai-native-ux/        # Demo 1: Direct-action routing & HITL cockpit
│   │   │   ├── controller.js    # Domain-isolated logic
│   │   │   └── styles.css       # Domain-scoped styling
│   │   ├── generative-ui/       # Demo 2: Dynamic viewport component synthesis
│   │   └── ambient-agents/      # Demo 3: Multi-agent background coordination
│   │
│   └── shared/                  # Navigation bar, Giscus comments, GitHub star widget
│
├── functions/                   # Cloudflare Pages Edge Functions (Serverless)
│   ├── _middleware.js           # Edge routing & security headers
│   └── api/
│       ├── github-stars.js      # Cached GitHub repo telemetry
│       └── agent-session.js     # Ephemeral session token generation
│
└── .github/workflows/
    └── deploy.yml               # Automated Cloudflare Pages build on push to main
```

---

## 🛠️ Step-by-Step Refactoring Plan

| Area | Current Implementation | Target Modular Pattern (Next Demos) |
| :--- | :--- | :--- |
| **JS Architecture** | Single `js/app.js` | ES module tree with feature-specific subcontrollers (`import { initHITL } from './modules/hitl.js'`) |
| **CSS Architecture** | Single `styles/main.css` | Modular token layer (`tokens.css`), base components (`ui.css`), and demo overrides (`ai-native.css`) |
| **Edge Functions** | Pure static client | Cloudflare Pages `functions/` for edge caching, telemetry, and secure proxying |
| **CI/CD Automation** | Local build + upload script | GitHub Actions running `cloudflare/pages-action@v1` on push to `main` |
| **Preview Environments** | Manual staging | Automated branch preview URLs (`https://<branch>.workbench-wpd.pages.dev`) |

---

## 📝 Commitments for Next Demo
* Do not rewrite or destabilize the existing **AI-Native UX** module.
* Scaffold subsequent demo modules using the modular component directory structure.
* Wire automated GitHub Actions deployment to Cloudflare Pages.
