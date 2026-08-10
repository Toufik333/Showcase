# Dashboard Main Website — Project Context

> **Purpose:** This file gives any new AI chat or developer instant context about this project.

## What Is This?

A **minimal, Apple-inspired portfolio landing page** for a developer named Toufik. It's built as a static site using modern tooling but designed to be deployed on traditional shared hosting (Namecheap cPanel).

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x (via `@tailwindcss/postcss`) |
| Icons | lucide-react | 0.475.x |
| Font | Inter (via `next/font/google`) | — |

## Project Structure

```
src/
├── app/
│   ├── globals.css        ← Tailwind v4 import, custom animations (fadeInUp)
│   ├── layout.tsx         ← Root layout: Inter font, SEO meta, body classes
│   └── page.tsx           ← Main page: assembles all components below
└── components/
    ├── Navbar.tsx          ← Sticky glassmorphism nav, "T" logo, mobile hamburger
    ├── Hero.tsx            ← Badge, gradient headline, intro, 2 CTA buttons
    ├── ProjectGrid.tsx     ← 6 mock project cards in a 3-col responsive grid
    └── Footer.tsx          ← Copyright + GitHub/LinkedIn/Mail icons
```

### Config Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | `output: "export"` for static HTML generation (no Node.js server needed) |
| `postcss.config.mjs` | Tailwind CSS v4 via `@tailwindcss/postcss` plugin |
| `tsconfig.json` | TypeScript with `@/*` path alias → `./src/*` |

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#fbfbfd` | Page background |
| Text Primary | `#1d1d1f` | Headings, logo, hover states |
| Text Secondary | `#86868b` | Body text, muted labels, tags |
| Card Style | `bg-white rounded-2xl border-zinc-200/80 shadow-sm` | Project cards |
| Navbar | `backdrop-blur-md bg-[#fbfbfd]/80` | Glassmorphism sticky header |
| Typography | Inter, `tracking-tight`, `font-semibold` | Apple-style clean type |

## Commands

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Build static export → generates `out/` folder
npm run start    # Serve production build locally
npm run lint     # Run ESLint
```

## Deployment

This site is configured for **static export** (`output: "export"` in `next.config.mjs`).

### Deploy to Namecheap cPanel:
1. Run `npm run build` — generates static files in the `out/` directory
2. A ready-to-upload zip exists at `portfolio-deploy.zip` (476KB)
3. Upload & extract the zip contents into `public_html` via cPanel File Manager
4. Add this `.htaccess` in `public_html` for 404 routing:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /404.html [L]
   ```

## Key Decisions & Notes

- **No Node.js server required** — the site is fully static HTML/CSS/JS after build.
- **Tailwind CSS v4** uses the new `@import "tailwindcss"` syntax (not v3's `@tailwind` directives).
- **All project data is hardcoded** in `ProjectGrid.tsx` — no CMS or API. Edit the `projects` array directly to update.
- **Animations** are CSS-only (`fadeInUp` with staggered delays), defined in `globals.css`.
- **Mobile responsive** — navbar collapses to hamburger menu, grid goes 1→2→3 columns.
- The `package.json` name is `dashboard-main-website` (lowercase) because npm doesn't allow capital letters, even though the directory is `dashboardMainWebsite`.
