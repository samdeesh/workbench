# 🛠️ Foundry.blog Workbench

[![Static Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-blue?logo=github)](https://samdeesh.github.io/workbench/)
[![Blog](https://img.shields.io/badge/Blog-Foundry.blog-purple)](https://foundry.blog/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

Interactive workbench repository hosting live engineering demonstrations and architectural blueprints for articles published on [Foundry.blog](https://foundry.blog/).

Zero server dependencies. Hosted statically on GitHub Pages.

---

## 💻 Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup & Structure** | **HTML5** | Semantic, accessible markup structured into modular directories |
| **Styling & Design System** | **Vanilla CSS3** | Enterprise Material palette (blues, crisp grays, semantic alert tokens), zero CSS runtime overhead, custom properties, responsive design |
| **Interactivity & Logic** | **Modern JavaScript (ES Modules)** | Vanilla JS with no heavy UI framework runtime; state management, dynamic DOM projection, URL hash routing (`#level-1`, `#level-2`, `#level-3`) |
| **Bundling & Tooling** | **Vite 6** | Ultra-fast local dev server with multi-page HTML bundling for `/` and `/ai-native-ux/` |
| **Automation & Capture** | **Puppeteer 25** | Headless browser automation for automated visual interaction capture |
| **Hosting & Deployment** | **GitHub Pages + Actions** | Fully automated, zero-touch CI/CD static deployment |

---

## 🏛️ Repository Architecture & Routing

The repository is designed as an extensible multi-demo hub:

```
.
├── index.html                  # Site Home: Catalog of articles and companion demos
├── ai-native-ux/               # Module: AI-Native UX Interactive Showcase
│   └── index.html              # Dedicated module route with 3 levels on flat nav tabs
├── styles/
│   └── main.css                # Material enterprise palette, design system tokens
├── js/
│   └── app.js                  # Modular controller for search, HITL, autopilot, & tabs
├── assets/
│   └── images/                 # Showcase screenshots and animations
├── vite.config.js              # Multi-page configuration for Vite
└── README.md
```

---

## 🚀 Interactive Demos

### 1. AI-Native UX: Beyond the Chat Box (`/ai-native-ux/`)
Companion demo for the article **"AI-Native UX: Beyond the Chat Box"** by **Samdeesh Menia**. Moving beyond Level 1 conversational chat friction into 3 progressive levels organized on **flat navigation tabs**:

1. **Level 2 • Direct-Action Routing**:
   - Query typing (`"statements"`, `"margin"`, `"churn"`) auto-suggests immediate actionable destinations.
   - Projects directly into operational pages: Treasury Statements with 1-click PDF download, Operating Margin with inactive SaaS license reclamation, and Customer Churn risk cockpit.
2. **Level 3 • Proactive Human-in-the-Loop Governance (HITL)**:
   - Background AI isolates latency anomalies (+14.8% on EU payment gateway) and pre-synthesizes a verified remediation plan.
   - Human supervisor acts purely as an authorization checkpoint with 1-click signoff.
3. **Level 4 • Autopilot Operations Log & Smart Approvals**:
   - Stream of autonomous self-healing events running continuously within guardrails.
   - Interactive review drawer for pending items with **recommended decision pills** and **custom policy override directives**.

---

## 🛠️ Local Development

```bash
# Start local dev server with Vite
npm run dev

# Or test static serving with Python
python3 -m http.server 8080
```

---

## ✍️ Author & Links

- **Author:** Samdeesh Menia
- **Blog:** [foundry.blog/samdeesh](https://foundry.blog/samdeesh/)
- **License:** MIT
