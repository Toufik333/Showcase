# Showcase — Full-Stack Developer Portfolio & Web Portal

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
</p>

A modern, high-performance **multi-application showcase portal** built with Next.js 15 (App Router), React 19, and Tailwind CSS v4. Backed by dual databases (**MySQL** for relational financial & order tracking, and **MongoDB Atlas** for document-based cloud notes), complete with custom JWT authentication, responsive glassmorphism UI, and production deployment scripts for cPanel/Passenger environments.

---

## 🌟 Live Applications

### 1. 💼 Portfolio Landing Page (`/`)
- **Aesthetic:** Apple-inspired minimalist design with typography-focused hierarchy.
- **Components:** Dynamic glassmorphism navbar, hero section with call-to-actions, responsive project showcase grid, and direct social/contact integration.

### 2. 💰 Money Tracker App (`/tracker`)
- **Auth:** Dedicated JWT user authentication (`tracker_session` HTTP-only cookie, bcrypt password hashing).
- **Dashboard:** Real-time financial calculations (Total Balance, Total Income, Total Expenses).
- **Views:** Switch between an interactive Monthly Calendar View and detailed Transaction Lists.
- **CRUD:** Fast modal-driven creation, categorization, date filtering, and deletion of income/expense records.
- **Database:** MySQL / MariaDB via connection pooling (`mysql2/promise`).

### 3. 🛍️ E-Commerce Storefront & Admin Portal (`/shop`)
- **Storefront (`/shop`):** Modern product showcase cards with instant "Add to Cart" functionality.
- **Cart Management:** Persistent shopping cart state (`CartContext` + LocalStorage) with dynamic item counts, subtotal calculation, and drawer toggle.
- **Checkout (`/shop/checkout`):** Seamless Cash on Delivery (COD) order placement with shipping info validation.
- **Admin Portal (`/shop/admin/login` & `/shop/admin/dashboard`):**
  - Secured via fixed credentials (`admin1`, `admin2`, `admin3`) and dedicated admin session cookies (`admin_session`).
  - Live order management with fulfillment status switches (`pending`, `shipped`, `done`, `cancelled`).
  - Product management with inline creation and price/inventory updates.
- **Database:** Relational MySQL schema (`products`, `orders`, `order_items`, `admins`).

### 4. 📝 Cloud Notes App (`/notes`)
- **Auth:** Independent user signup and login system (`notes_session` JWT cookie).
- **Organization:** User-isolated notes with color-coded tags, title/content editing, and pin-to-top prioritization.
- **Real-Time Search:** Instant client-side search filtering across titles and note contents.
- **Database:** Cloud-synced MongoDB Atlas with automatic indexing.

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 15.3.x | Hybrid Server-Side Rendering (SSR) & API Route Handlers |
| **UI Library** | React | 19.x | Component-driven user interfaces |
| **Language** | TypeScript | 5.x | End-to-end static typing & safety |
| **Styling** | Tailwind CSS | 4.x | Utility-first styling via `@tailwindcss/postcss` |
| **Icons** | Lucide React | 0.475.x | Clean, consistent SVG icons |
| **Database 1** | MySQL / MariaDB | 8.x / 10.x | Relational storage for Money Tracker and E-Commerce |
| **Database 2** | MongoDB Atlas | 6.x driver | Document storage for Cloud Notes |
| **Authentication** | `jose` + `bcryptjs` | — | Stateless, secure JWT cookie signing & password hashing |
| **Date Utilities** | `date-fns` | 4.x | Date formatting & calendar month navigation |
| **Production Server** | Custom Node.js (`server.js`)| — | Compatible with cPanel / Phusion Passenger hosting |

---

## 📁 Project Structure

```text
├── public/                     # Static assets (images, icons)
├── scripts/
│   └── build-deploy-zip.py     # Windows-to-Linux deployment packager with POSIX permissions
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── notes/          # Notes CRUD & auth endpoints
│   │   │   ├── shop/           # Storefront products & admin orders endpoints
│   │   │   └── tracker/        # Money tracker transactions & auth endpoints
│   │   ├── notes/              # Notes app pages (login, signup, dashboard)
│   │   ├── shop/               # Storefront, cart checkout & admin portal pages
│   │   ├── tracker/            # Money tracker pages (login, signup, dashboard)
│   │   ├── globals.css         # Tailwind directives and theme variables
│   │   ├── layout.tsx          # Root HTML layout with Inter font
│   │   └── page.tsx            # Portfolio homepage
│   ├── components/
│   │   ├── notes/              # NoteCard, NoteModal, SearchBar
│   │   ├── shop/               # ShopNavbar, Cart Drawer
│   │   ├── tracker/            # CalendarView, StatCards, TransactionList
│   │   ├── Footer.tsx          # Site footer with contact links
│   │   ├── Hero.tsx            # Portfolio hero section
│   │   ├── Navbar.tsx          # Glassmorphism navigation bar
│   │   └── ProjectGrid.tsx     # Featured work grid
│   ├── context/
│   │   └── CartContext.tsx     # Global cart state & localStorage persistence
│   ├── lib/
│   │   ├── auth.ts             # JWT sign/verify & cookie utilities
│   │   ├── db.ts               # MySQL connection pool & automatic table provisioner
│   │   └── mongodb.ts          # MongoDB Atlas client singleton
│   └── middleware.ts           # Route protection for protected dashboards
├── .env.example                # Template for environment variables
├── next.config.mjs             # Next.js configuration
├── package.json                # Project dependencies and npm scripts
├── schema.sql                  # Complete MySQL schema & initial seed data
├── server.js                   # Custom HTTP server for cPanel/Passenger
└── tsconfig.json               # TypeScript configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: `v18.17.0` or later (Node 20+ recommended)
- **MySQL / MariaDB**: Running locally on port `3306` (e.g. via XAMPP, Docker, or native service)
- **MongoDB Atlas**: Free cluster connection string (`mongodb+srv://...`)

### 1. Clone the Repository
```bash
git clone https://github.com/Toufik333/Showcase.git
cd Showcase
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=money_tracker
DB_SSL=false

# Authentication Secret (random 64+ char string)
JWT_SECRET=your_super_secret_random_jwt_key_here

# E-Commerce Admin Password
ADMIN_DEFAULT_PASSWORD=admin123

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0
MONGODB_DB=notes_app

# Node Environment
NODE_ENV=development
```

### 4. Initialize MySQL Database
Import [schema.sql](file:///c:/Users/toufi/OneDrive/Documents/Github%20Antigravity%20Files/Showcase/schema.sql) into your local MySQL server (via phpMyAdmin or MySQL CLI):
```bash
mysql -u root -p money_tracker < schema.sql
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials

| Portal | Route | Default Account | Default Password |
|---|---|---|---|
| **Shop Admin** | `/shop/admin/login` | `admin1` / `admin2` / `admin3` | `admin123` |
| **Money Tracker** | `/tracker/login` | Create via `/tracker/signup` | User chosen |
| **Notes App** | `/notes/login` | Create via `/notes/signup` | User chosen |

---

## 📦 Deployment (cPanel / Namecheap / Linux Server)

When packaging a Next.js project from Windows to shared Linux hosting (such as Namecheap cPanel with Phusion Passenger), standard Windows zip utilities strip POSIX directory execute permissions (`+x` / `0755`), triggering `Error 503 (EACCES permission denied)`.

This project includes a dedicated Python packaging script that creates a deployment ZIP with native Unix permissions:

```bash
# 1. Build the production application locally
npm run build

# 2. Package into namecheap-deploy.zip with POSIX 0755/0644 permissions
npm run build:zip
```

### cPanel Steps:
1. Upload and extract `namecheap-deploy.zip` into `public_html`.
2. In **cPanel → MySQL Databases**, create your database and user.
3. In **phpMyAdmin**, import `schema.sql`.
4. In **Setup Node.js App**:
   - **Node version:** `18.x` or `20.x`
   - **Mode:** `Production`
   - **Application startup file:** `server.js`
   - Click **Run NPM Install**.
5. Add your `.env` file in the root folder with your server credentials.
6. Click **Restart**.

---

## 👤 Author

**Toufik**
- **GitHub:** [@Toufik333](https://github.com/Toufik333)
- **LinkedIn:** [linkedin.com/in/toufik333](https://www.linkedin.com/in/toufik333)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
