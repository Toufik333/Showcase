# Dashboard Main Website — Project Context

> **Purpose:** This file gives any new AI chat or developer instant context about this project.

## What Is This?

A **Next.js full-stack application** with three main parts:

1. **Portfolio Landing Page** (`/`) — Apple-inspired minimal portfolio for a developer named Toufik. Features a glassmorphism navbar, animated hero section, and 6 project cards.
2. **Money Tracker App** (`/tracker`) — Full-stack personal finance tracker backed by MySQL. Includes JWT authentication, transaction CRUD, monthly dashboard with stat cards, and list/calendar views.
3. **Notes App** (`/notes`) — Cloud-synced note-taking app backed by MongoDB Atlas. Features color-coded note cards, pinning, real-time search, and full CRUD — no authentication required.

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15.x | SSR + API routes |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x (via `@tailwindcss/postcss`) | Utility-first CSS |
| Icons | lucide-react | 0.475.x | SVG icon library |
| Font | Inter (via `next/font/google`) | — | Typography |
| Database | MySQL (via XAMPP) | — | Transaction & user storage |
| Database | MongoDB Atlas | — | Notes storage (cloud) |
| DB Driver | mysql2/promise | — | MySQL connection pool |
| DB Driver | mongodb | 6.x | MongoDB driver |
| Auth | jose + bcryptjs | — | JWT tokens + password hashing |
| Dates | date-fns | — | Date formatting & manipulation |

## Project Structure

```
src/
├── middleware.ts                           ← Protects /tracker/dashboard (JWT check)
├── lib/
│   ├── db.ts                              ← MySQL pool, auto-creates DB + tables
│   ├── auth.ts                            ← JWT sign/verify, bcrypt, cookie helpers
│   └── mongodb.ts                         ← MongoDB Atlas connection singleton
├── app/
│   ├── globals.css                        ← Tailwind v4 import, fadeInUp animations
│   ├── layout.tsx                         ← Root layout: Inter font, SEO meta
│   ├── page.tsx                           ← Portfolio homepage (assembles components)
│   ├── tracker/
│   │   ├── page.tsx                       ← Redirect: auth → dashboard, else → login
│   │   ├── login/page.tsx                 ← Login form (client component)
│   │   ├── signup/page.tsx                ← Signup form with validation
│   │   └── dashboard/page.tsx             ← Main tracker dashboard (client component)
│   ├── notes/
│   │   └── page.tsx                       ← Notes dashboard (client component)
│   └── api/
│       ├── notes/
│       │   ├── route.ts                   ← GET (list + search) + POST (create)
│       │   └── [id]/route.ts              ← PUT (update) + DELETE
│       └── tracker/
│           ├── auth/
│           │   ├── signup/route.ts        ← POST: create user, return JWT cookie
│           │   ├── login/route.ts         ← POST: validate creds, return JWT cookie
│           │   └── logout/route.ts        ← POST: clear JWT cookie
│           └── transactions/
│               ├── route.ts              ← GET (list by month) + POST (create)
│               └── [id]/route.ts          ← PUT (update) + DELETE
└── components/
    ├── Navbar.tsx                          ← Sticky glassmorphism nav, "T" logo
    ├── Hero.tsx                            ← Badge, gradient headline, 2 CTA buttons
    ├── ProjectGrid.tsx                     ← 6 project cards (1st→tracker, 2nd→shop, 3rd→notes)
    ├── Footer.tsx                          ← Copyright + social icons
    ├── notes/
    │   ├── NoteCard.tsx                   ← Color-coded note card with pin toggle
    │   ├── NoteModal.tsx                  ← Create/Edit note modal with color picker
    │   └── SearchBar.tsx                  ← Debounced search input
    └── tracker/
        ├── MonthNavigator.tsx             ← < August 2026 > chevron navigation
        ├── StatCards.tsx                   ← Balance / Income / Expenses cards
        ├── ViewToggle.tsx                 ← List ↔ Calendar pill toggle
        ├── TransactionModal.tsx           ← Add/Edit/Delete transaction form
        ├── TransactionList.tsx            ← Date-grouped list with category icons
        └── CalendarView.tsx               ← Monthly grid with daily totals
```

### Config Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Images unoptimized (no static export — API routes require Node.js) |
| `postcss.config.mjs` | Tailwind CSS v4 via `@tailwindcss/postcss` plugin |
| `tsconfig.json` | TypeScript with `@/*` path alias → `./src/*` |

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#fbfbfd` | Page background |
| Text Primary | `#1d1d1f` | Headings, logo, hover states |
| Text Secondary | `#86868b` | Body text, muted labels, tags |
| Card Style | `bg-white rounded-2xl border-zinc-200/80 shadow-sm` | Project cards, transaction rows |
| Navbar | `backdrop-blur-md bg-[#fbfbfd]/80` | Glassmorphism sticky header |
| Typography | Inter, `tracking-tight`, `font-semibold` | Apple-style clean type |

## Database (MySQL via XAMPP)

- **Host:** `localhost:3306`, **User:** `root`, **Password:** *(none)*
- **Database:** `money_tracker` (auto-created on first connection)

### Tables (auto-provisioned by `lib/db.ts`)

**`users`**
| Column | Type |
|--------|------|
| id | INT, AUTO_INCREMENT, PK |
| username | VARCHAR(50), UNIQUE |
| password_hash | VARCHAR(255) |
| created_at | TIMESTAMP |

**`transactions`**
| Column | Type |
|--------|------|
| id | INT, AUTO_INCREMENT, PK |
| user_id | INT, FK → users.id (CASCADE) |
| type | ENUM('deposit', 'withdraw') |
| amount | DECIMAL(10,2) |
| category | VARCHAR(50) |
| note | TEXT, nullable |
| transaction_date | DATE |
| created_at | TIMESTAMP |

## Authentication Flow

1. User signs up/logs in → API hashes password (bcrypt) and returns JWT in HTTP-only cookie (`tracker_session`)
2. `middleware.ts` checks JWT on every `/tracker/dashboard` request
3. API routes use `getSession()` to extract user ID from cookie
4. JWT signed with HS256, 7-day expiry, secret from `JWT_SECRET` env var (dev fallback provided)

## Commands

```bash
npm run dev      # Start dev server → http://localhost:3000 (XAMPP MySQL must be running)
npm run build    # Production build (verifies TypeScript + routes)
npm run start    # Serve production build locally
npm run lint     # Run ESLint
```

## Key Decisions & Notes

- **No static export** — `output: "export"` was removed because API routes require a Node.js server. The portfolio homepage still works, but can't be deployed as plain HTML anymore.
- **XAMPP MySQL required** — must be running on port 3306 before `npm run dev`. The app auto-creates the database and tables.
- **Tailwind CSS v4** uses `@import "tailwindcss"` syntax (not v3's `@tailwind` directives).
- **All portfolio project data is hardcoded** in `ProjectGrid.tsx` — the first card ("Money Tracker") links to `/tracker`, the rest are mock projects.
- **Transaction categories:** Salary, Investments, Freelance, Food, Rent, Utilities, Entertainment, Shopping, Transport, Healthcare, Other.
- **Two dashboard views:** List (date-grouped, sorted newest first) and Calendar (monthly grid with daily totals, clickable days).
- **Mobile responsive** — navbar collapses to hamburger, grids adapt, modal slides up from bottom on mobile.
- The `package.json` name is `dashboard-main-website` (lowercase) because npm doesn't allow capital letters, even though the directory is `dashboardMainWebsite`.
