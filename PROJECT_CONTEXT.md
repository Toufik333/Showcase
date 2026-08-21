# Dashboard Main Website — Project Context

> **Purpose:** This file gives any new AI chat or developer instant context about this project, its architecture, and its deployment workflow.

## What Is This?

A **Next.js full-stack multi-app web portal** containing:

1. **Portfolio Landing Page** (`/`) — Apple-inspired minimal developer portfolio with a glassmorphism navbar, hero section, and project cards linking to the apps.
2. **Money Tracker App** (`/tracker`) — Full-stack personal finance tracker backed by MySQL. Features JWT authentication (signup/login/logout), transaction CRUD (income/expense), monthly dashboard with stat cards, and list/calendar views.
3. **E-Commerce Store & Admin** (`/shop`, `/shop/admin`) — Storefront with product catalogue, cart & checkout, plus admin authentication, product management, and order tracking backed by MySQL.
4. **Notes App** (`/notes`, `/notes/login`, `/notes/signup`) — Cloud-synced note-taking app backed by MongoDB Atlas with dedicated user authentication (signup/login/logout), user-isolated notes, color-coded cards, pinning, live search filtering, and full CRUD.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15.x | SSR + API routes |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x (via `@tailwindcss/postcss`) | Utility-first CSS |
| Icons | lucide-react | 0.475.x | SVG icon library |
| Font | Inter (via `next/font/google`) | — | Typography |
| Database 1 | MySQL / MariaDB | — | Tracker & Shop data (users, transactions, products, orders, admins) |
| Database 2 | MongoDB Atlas | — | Notes app cloud storage (users & notes collections) |
| DB Drivers | `mysql2/promise`, `mongodb` (v6.x) | — | Connection pooling & client instances |
| Auth | `jose` + `bcryptjs` | — | JWT cookies (`tracker_session`, `admin_session`, `notes_session`) + bcrypt password hashing |
| Dates | `date-fns` | — | Date formatting & manipulation |

---

## Project Structure

```
src/
├── middleware.ts                           ← Protects /tracker/dashboard, /shop/admin/dashboard, /notes
├── lib/
│   ├── db.ts                              ← MySQL pool, auto-provisions tables & seeds
│   ├── auth.ts                            ← JWT sign/verify, bcrypt, cookie helpers (tracker, admin, notes)
│   └── mongodb.ts                         ← MongoDB Atlas connection singleton (users & notes)
├── app/
│   ├── layout.tsx                         ← Root layout (Inter font, metadata)
│   ├── page.tsx                           ← Portfolio homepage
│   ├── tracker/                           ← Money tracker routes (login, signup, dashboard)
│   ├── shop/                              ← Storefront & admin routes (login, dashboard, checkout)
│   ├── notes/                             ← Notes app routes (login, signup, app page)
│   └── api/
│       ├── tracker/                       ← Auth & transactions API
│       ├── shop/                          ← Storefront & admin orders/products API
│       └── notes/                         ← Notes Auth & CRUD API
└── components/
    ├── Navbar.tsx, Hero.tsx, Footer.tsx   ← Portfolio components
    ├── ProjectGrid.tsx                    ← Project cards linking to apps
    ├── tracker/                           ← StatCards, TransactionList, CalendarView, modals
    └── notes/                             ← NoteCard, NoteModal, SearchBar
```

---

## Environment Variables (`.env`)

| Variable | Description | Example (Local Dev) | Example (Namecheap Production) |
|----------|-------------|---------------------|--------------------------------|
| `DB_HOST` | MySQL hostname | `localhost` | `localhost` |
| `DB_PORT` | MySQL port | `3306` | `3306` |
| `DB_USER` | MySQL user | `root` | `cpaneluser_dbuser` |
| `DB_PASSWORD` | MySQL password | `""` | `your_db_password` |
| `DB_NAME` | MySQL database | `money_tracker` | `cpaneluser_money_tracker` |
| `DB_SSL` | MySQL SSL mode | `false` | `false` |
| `JWT_SECRET` | JWT encryption secret | *(dev string)* | `64+ char random string` |
| `ADMIN_DEFAULT_PASSWORD` | E-Commerce Admin default password | `admin123` | `your_admin_default_password` |
| `MONGODB_URI` | Atlas MongoDB connection string | `mongodb+srv://...` | `mongodb+srv://...` |
| `MONGODB_DB` | MongoDB database name | `notes_app` | `notes_app` |
| `NODE_ENV` | Environment mode | `development` | `production` |

---

## Development & Build Commands

```bash
npm run dev        # Start local dev server (http://localhost:3000)
npm run build      # Next.js production build (generates .next)
npm run build:zip  # Packages project into namecheap-deploy.zip with Linux POSIX permissions
npm run start      # Run local production server via server.js
npm run lint       # Run ESLint validation
```

---

## Deployment Workflow (Namecheap Shared Hosting / cPanel)

### ⚠️ Critical Requirements Before Creating the Deployment ZIP

When deploying from a **Windows machine** to a **Linux server (Namecheap / cPanel)**, standard Windows tools like PowerShell's `Compress-Archive` or File Explorer ZIP **strip Linux directory execute permissions (`+x` / `0755`)**. When extracted on cPanel, Node.js cannot traverse nested directories and throws:
`[Error: EACCES: permission denied, scandir '/.../.next/static/...']` (resulting in Error 503).

To prevent this, follow the exact pre-zip checklist:

#### 1. Configure `next.config.mjs`
Do **not** use `output: "standalone"` if you intend to run `npm install` on the server. Keep the config standard:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
```

#### 2. Run Local Production Build
Run `npm run build` locally on your PC so the `.next/` build artifact is compiled and verified without CPU limits.

#### 3. Exclude Unnecessary Files from the ZIP
The ZIP must **exclude**:
- `node_modules/` (server will install its own via cPanel's `npm install`)
- `.env` (contains local secrets; created manually on server)
- `.next/cache/` (temporary cache files, saves ~50MB+)
- `.git/`, `.DS_Store`, `.zip`

#### 4. Embed Explicit POSIX Permissions (0755 Dirs / 0644 Files)
Use the included script `scripts/build-deploy-zip.py` (or run `npm run build:zip`). It sets:
- **Directories:** `0o040755` (`rwxr-xr-x`) — ensures Linux can open, scan, and read all folders.
- **Files:** `0o100644` (`rw-r--r--`) — ensures files are readable by Passenger/Node.js.

```bash
# One command to build and package:
npm run build
npm run build:zip
```

Output file: **`namecheap-deploy.zip`** (~1.7 MB).

---

### Step-by-Step Server Setup in cPanel

1. **MySQL Database**: Create database & user via **cPanel → MySQL Database Wizard** (note the prefixed names: `cpaneluser_dbname`, `cpaneluser_dbuser`). Import `schema.sql` via **phpMyAdmin**.
2. **File Upload**: In **cPanel File Manager**, upload `namecheap-deploy.zip` into your application folder (e.g., `public_html` or `app`) and click **Extract**.
3. **Environment File**: In File Manager, create `.env` in the app root with server credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `MONGODB_URI`, `MONGODB_DB`, `NODE_ENV=production`).
4. **Setup Node.js App**: In cPanel:
   - Node.js version: **18.x or 20.x**
   - Application mode: **Production**
   - Application root: `public_html` (or `app`)
   - Application startup file: `server.js`
   - Click **Create**.
5. **Install Dependencies**: Click the **"Run NPM Install"** button on the Node.js setup page.
6. **MongoDB Atlas IP Whitelist**: In MongoDB Atlas → **Network Access**, whitelist the server IP (or `0.0.0.0/0`).
7. **Restart App**: Click **Restart** in the Node.js App manager.
