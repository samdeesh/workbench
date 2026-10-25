# 🤖 AGENTS.md — Repository Instructions & Guidelines for AI Agents

Welcome to the **Foundry.blog Interactive Demos** repository (`blog-demos`). This document defines the architectural patterns, styling conventions, branding rules, and development workflows for AI agents contributing to this codebase.

---

## 🏛️ Project Purpose & Overview

This repository hosts companion interactive demonstrations and architectural blueprints for technical articles published on **[Foundry.blog](https://foundry.blog/)**.

The project is built with **zero server dependencies** and is hosted statically on **GitHub Pages**, with local development powered by **Vite**.

---

## 🏷️ Branding & Identity Rules

When modifying, extending, or creating new pages, strictly follow these brand guidelines:

1. **Main Brand is `Foundry.blog`**:
   - Header badge mark: `FB`
   - Header brand title: `Foundry.blog`
   - Backlink / Homepage: `https://foundry.blog/`
   - *Note on "Foundry Corp":* "Foundry Corp" is strictly a fictional mock company used as an in-demo scenario (e.g., Treasury Statements, Payment Gateway, Autopilot cluster). It is **not** the site brand.

2. **Terminology: Use "Article", Never "Essay"**:
   - Refer to technical posts as **articles** or **demos**.
   - Do **not** use "essay" or "essays" in titles, buttons, badges, descriptions, or metadata.
   - Standard button CTA: `Read more on Foundry.blog ↗` (pointing to `https://foundry.blog/`).

3. **Author Attribution Constraint**:
   - The author name (**Samdeesh Menia**) must **only** appear on the specific **article description or byline**.
   - Do **not** include the author name in global site headers, footers, site-wide `<title>`, or site-wide `<meta>` tags.

---

## 🗺️ Routing & Multi-Module Architecture

The repository uses a multi-page static directory structure:

```
.
├── index.html                  # Site Home: Catalog of articles and companion demos
├── ai-native-ux/               # Module Route: /ai-native-ux/
│   └── index.html              # Dedicated interactive demo with flat nav tabs
├── styles/
│   └── main.css                # Enterprise design system (Material palette)
├── js/
│   └── app.js                  # Modular controller (search, HITL, autopilot, tabs)
├── assets/
│   └── images/                 # Showcase screenshots and visual interaction GIFs
├── scripts/
│   └── capture-showcase.mjs    # Puppeteer visual verification & frame capture script
├── vite.config.js              # Multi-page Vite entrypoints
├── AGENTS.md                   # Agent guidelines (this file)
└── README.md                   # Public repository documentation
```

### Module Route Conventions:
- **Site Home (`/`):** Central directory linking to all demo modules and articles on Foundry.blog.
- **Dedicated Demo Routes (`/<slug>/index.html`):** Each interactive demo lives in its own subdirectory (e.g. `/ai-native-ux/`, and upcoming `/generative-ui/`, `/ambient-agents/`).
- **Relative Linking:** Use relative paths (`./`, `../`) so GitHub Pages serves cleanly from any subpath.
- **Vite Multi-Page Config:** Whenever adding a new module, register its HTML entry point in `vite.config.js` under `build.rollupOptions.input`.

---

## 📑 Demo Levels & Flat Nav Tabs Convention

In the **AI-Native UX** module and related architecture demos:

- The paradigm shift moves away from **Level 1 (Conversational Chatbot / CLI)**.
- Therefore, interactive levels are numbered starting from **Level 2+**:
  - **Level 2 • Direct-Action Routing:** Intent search auto-suggests and projects directly onto executable page surfaces.
  - **Level 3 • Proactive Governance (HITL):** Ambient anomaly detection with 1-click human supervisor signoff.
  - **Level 4 • Autopilot Operations:** Continuous autonomous activity stream with smart recommendation pills and policy override directives.
- Use **flat navigation tabs** (`.level-tabs-nav` with `.level-tab-btn`) with smooth transitions and deep-linking `#level-2`, `#level-3`, `#level-4`.

---

## 💻 Tech Stack & Standards

- **HTML5:** Semantic, accessible elements, proper `<nav>`, `<main>`, `<section>`, `<article>`, and `aria-*` tags.
- **Vanilla CSS3:** Custom properties (`--primary-blue`, `--gray-50` to `--gray-900`, `--status-*`), zero CSS framework dependencies, responsive flexbox and grid.
- **Modern JavaScript (ES Modules):** Vanilla JS with zero runtime framework overhead. Fast, direct DOM manipulation, clean event listeners, and URL hash sync.
- **Vite 6:** Instant HMR dev server (`npm run dev`) and production multi-page bundler (`npm run build`).
- **Puppeteer 25:** Headless interaction testing and visual regression capture.

---

## 🛠️ Verification & Build Commands

Always run these commands to verify any changes before finishing:

```bash
# 1. Verify production build
npm run build

# 2. Verify git status
git status

# 3. Optional: Run visual interaction tests
node scripts/capture-showcase.mjs
```
