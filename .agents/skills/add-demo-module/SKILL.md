---
name: add-demo-module
description: Scaffold and register a new interactive article demo module in the Foundry.blog demos repository
---

# Add Demo Module Workflow

Use this skill whenever you need to add a new interactive companion demo for an article on Foundry.blog.

## Architectural Conventions

1. **Module Location:**
   - Create a dedicated folder: `/<article-slug>/`
   - Create entry point: `/<article-slug>/index.html`

2. **Branding & Header:**
   - Main brand badge: `FB` • `Foundry.blog` linking to `../`
   - Breadcrumb navigation: `Foundry.blog / Articles / <Article Title>`
   - External header link: `Read more on Foundry.blog` (`https://foundry.blog/`)
   - Author attribution: Place `Article by Samdeesh Menia` **strictly on the article byline/description**, never in headers or global footers.

3. **Flat Nav Tabs for Interactive Levels:**
   - Group the demo into progressive levels on a flat navigation tab bar (`.level-tabs-nav`).
   - If extending the AI-Native paradigm, number levels starting from **Level 2+** (Level 2: Direct-Action Routing, Level 3: Proactive Governance, Level 4: Autopilot Operations).
   - Use `.level-tab-pane` with `active` state and deep-linking hash support.

4. **Register in Vite (`vite.config.js`):**
   - Add the new HTML file to `build.rollupOptions.input`:
     ```js
     input: {
       main: resolve(__dirname, 'index.html'),
       aiNativeUx: resolve(__dirname, 'ai-native-ux/index.html'),
       newModule: resolve(__dirname, '<article-slug>/index.html'),
     }
     ```

5. **Update Site Home (`index.html`):**
   - In `index.html`, add or activate the article card in the `#articles` grid.
   - Set status badge to `LIVE INTERACTIVE DEMO`.
   - Provide direct link: `<a href="./<article-slug>/" class="btn btn-primary">Launch Demo →</a>`.

6. **Update Sitemap & Verification:**
   - Add `<url>` entry to `sitemap.xml`.
   - Run `npm run build` to verify zero bundling or syntax errors.
