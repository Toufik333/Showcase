# 🚨 Namecheap Node.js Deployment — Issues Audit

> **Project:** Dashboard Main Website (Next.js 15 + MySQL + MongoDB)
> **Target:** Namecheap Shared Hosting (cPanel with Node.js Selector)
> **Audit Date:** August 19, 2026

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical (will break deployment) | 6 |
| 🟠 Major (will cause failures in production) | 5 |
| 🟡 Moderate (should fix before going live) | 4 |
| 🔵 Minor (best practice / recommendation) | 3 |

---

## 🔴 Critical Issues

### 1. Missing `output: "standalone"` in Next.js Config

**File:** [`next.config.mjs`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/next.config.mjs)

The current config only sets `images: { unoptimized: true }`. For Namecheap shared hosting, you **must** set `output: "standalone"` to generate a self-contained build that doesn't require the full `node_modules` tree at runtime.

Without this, the build output expects `next start` (which won't work with cPanel's Phusion Passenger) and will need the entire `node_modules` directory uploaded (~227KB `package-lock.json` means hundreds of MBs of modules).

```diff
 const nextConfig = {
+  output: "standalone",
   images: {
     unoptimized: true,
   },
 };
```

---

### 2. `package.json` Missing `"start"` Script for Custom Server

**File:** [`package.json`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/package.json)

The current `"start"` script is `"next start"`, but you have a custom [`server.js`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/server.js). Namecheap's cPanel Node.js App Selector uses the **startup file** (typically `server.js`) directly via Passenger, not npm scripts. However, the `server.js` file uses `require("next")` which may conflict with standalone output.

**Action needed:**
- If using `output: "standalone"`, the startup file should reference `.next/standalone/server.js` or be updated to work with standalone mode.
- The custom `server.js` and `output: "standalone"` are two different approaches — you need to pick one and align them.

---

### 3. MySQL Database Naming Convention Mismatch

**File:** [`.env`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/.env)  
**File:** [`db.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/db.ts)

On Namecheap shared hosting, **all MySQL database names and usernames are prefixed** with your cPanel username:
- Database: `cpaneluser_money_tracker` (not `money_tracker`)
- User: `cpaneluser_dbuser` (not `root`)

**Current `.env` values that will fail:**
```
DB_HOST=localhost        ← OK (same server)
DB_USER=root             ← ❌ root access is NOT available on shared hosting
DB_PASSWORD=             ← ❌ blank password won't work
DB_NAME=money_tracker    ← ❌ must be prefixed: cpaneluser_money_tracker
```

You need to:
1. Create the database + user via **cPanel → MySQL Databases Wizard**
2. Update `.env` with the prefixed names and actual credentials

---

### 4. `CREATE DATABASE` Will Fail — No Privilege on Shared Hosting

**File:** [`db.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/db.ts#L16-L35)

The `ensureDatabase()` function attempts `CREATE DATABASE IF NOT EXISTS`. On Namecheap shared hosting, the MySQL user **does not have** the `CREATE DATABASE` privilege. The function has a `try/catch` that silently swallows the error (line 31-34), which is good — **but** if the database doesn't exist yet, the subsequent `createPool()` call on line 199 will fail with a connection error because the database won't exist.

**Action needed:** You must manually create the database via cPanel **before** deploying.

---

### 5. MongoDB URI Hardcoded with Credentials in `.env`

**File:** [`.env`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/.env#L10)

The `.env` file contains a plaintext MongoDB Atlas connection string with credentials:
```
MONGODB_URI=mongodb+srv://xbrtoufik_db_user:2b9sCOC85rNkcUmZ@cluster0.kry5a3f.mongodb.net/...
```

> [!CAUTION]
> - The `.env` file is in `.gitignore`, which is correct. But make sure you **never** commit it.
> - The `.env.example` file is **missing** the `MONGODB_URI` and `MONGODB_DB` entries — anyone setting up will miss these.
> - On Namecheap, you'll need to add these as **Environment Variables** in the cPanel Node.js App dashboard.

---

### 6. MongoDB Atlas — IP Whitelist Not Configured for Namecheap

**Not a file issue — infrastructure concern**

MongoDB Atlas restricts connections by IP address. You need to whitelist the **Namecheap server's outbound IP** in your Atlas cluster's Network Access settings. Since shared hosting IPs can vary, you may need to:
- Whitelist `0.0.0.0/0` (allow from anywhere — less secure), or
- Find and whitelist Namecheap's specific server IP

Without this, the Notes App (`/notes`) will return 500 errors on every API call.

---

## 🟠 Major Issues

### 7. No `.nvmrc` or `engines` Field — Node.js Version Not Pinned

**File:** [`package.json`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/package.json)

The project doesn't specify which Node.js version it requires. Next.js 15 requires **Node.js 18.17+**. On Namecheap, you select the Node.js version in cPanel — but without documentation, you might pick an incompatible version.

**Add to `package.json`:**
```json
"engines": {
  "node": ">=18.17.0"
}
```

---

### 8. `connectionLimit: 10` Is Too High for Shared Hosting

**File:** [`db.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/db.ts#L202)

Namecheap shared hosting has strict MySQL connection limits (typically **max 25 concurrent connections** per cPanel account across ALL applications). A pool of 10 connections from a single app is aggressive and can exhaust the limit, especially under load or if the pool isn't properly drained.

**Recommended:** Reduce to `connectionLimit: 3` or `connectionLimit: 5`.

---

### 9. `npm run build` Cannot Be Run on Shared Hosting

**No specific file — deployment process concern**

Next.js builds are CPU and memory intensive. Namecheap shared hosting enforces strict resource limits (cannot use 25%+ CPU for more than 60 seconds). Running `npm run build` on the server **will fail or be killed**.

**Action needed:**
- Always build **locally** with `npm run build`
- Upload the pre-built `.next` directory (or standalone output) to the server
- Only run `npm install --production` on the server

---

### 10. Stale `/out` Directory Will Cause Confusion

**Directory:** [`out/`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/out)

There's a leftover `out/` directory with static HTML files (`index.html`, `404.html`). This appears to be from a previous `output: "export"` build. This could conflict with the Node.js SSR deployment or cause confusion during upload.

**Action needed:** Delete the `out/` directory before deploying.

---

### 11. Hardcoded Admin Passwords Seeded on Every Startup

**File:** [`db.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/db.ts#L111-L128)

The `seedData()` function runs on **every server startup** and seeds admin accounts with `admin123` as the password. On Namecheap, Phusion Passenger cold-starts the app on each request after idle. This means:
- `bcrypt.hash("admin123", 12)` runs on every cold start (CPU-heavy, ~250ms)
- If an admin changes their password, it won't be overwritten (the `SELECT` check prevents re-insert), but the cost factor 12 hash runs regardless
- The hardcoded password `admin123` is displayed on the login page UI

---

## 🟡 Moderate Issues

### 12. JWT Secret Fallback to Hardcoded Dev Value

**Files:**
- [`auth.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/auth.ts#L5-L7)
- [`middleware.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/middleware.ts#L5-L7)
- [`tracker/page.tsx`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/app/tracker/page.tsx#L5-L7)

All three files have a fallback:
```ts
process.env.JWT_SECRET || "dev-secret-money-tracker-2026"
```

If you forget to set `JWT_SECRET` in Namecheap's environment variables, the app will **silently use a publicly known secret**, making all JWTs forgeable. The production `.env` also has a weak secret value: `production-secret-key-change-this-to-a-random-string-2026`.

**Action needed:**
- Generate a proper random secret (64+ characters)
- Set it in cPanel's Node.js App environment variables
- Consider removing the fallback in production to fail loudly

---

### 13. `tlsAllowInvalidCertificates: true` for MongoDB

**File:** [`mongodb.ts`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/src/lib/mongodb.ts#L20-L23)

```ts
const clientOptions = {
  tls: true,
  tlsAllowInvalidCertificates: true,
};
```

This disables TLS certificate validation, making the connection vulnerable to man-in-the-middle attacks. For a production deployment, you should remove `tlsAllowInvalidCertificates: true` and use the standard TLS settings that MongoDB Atlas provides.

---

### 14. `DB_SSL=false` in `.env`

**File:** [`.env`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/.env#L6)

SSL is disabled for MySQL. While Namecheap's local MySQL connections (same server) may not strictly require SSL, it's best practice to enable it if the hosting supports it. Check your cPanel MySQL settings.

---

### 15. `.env.example` Is Incomplete

**File:** [`.env.example`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/.env.example)

The `.env.example` is missing `MONGODB_URI` and `MONGODB_DB` entries. Anyone deploying this project will miss configuring MongoDB, causing the Notes app to crash on startup (the `mongodb.ts` module throws if `MONGODB_URI` is undefined — line 12-16).

---

## 🔵 Minor / Best Practice

### 16. `.DS_Store` Files Tracked in Project

Multiple `.DS_Store` files exist:
- Root: `.DS_Store` (8KB)
- `src/.DS_Store` (6KB)
- `src/app/.DS_Store` (6KB)
- `src/components/.DS_Store` (6KB)

These macOS metadata files shouldn't be uploaded to the server. They're in `.gitignore` but may still be included in manual ZIP uploads.

---

### 17. No `.htaccess` File

Namecheap's cPanel Node.js App selector auto-generates `.htaccess` rules to route traffic to Passenger. You don't need to create one — but be aware that if there's an existing `.htaccess` in the `public_html` directory, it could conflict.

---

### 18. `next start` vs Custom `server.js` — Architecture Decision Needed

**Files:**
- [`server.js`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/server.js)
- [`package.json`](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/package.json#L8)

You have both `"start": "next start"` in `package.json` AND a custom `server.js`. These serve different purposes:
- `next start` → Uses Next.js built-in server
- `server.js` → Custom HTTP server wrapping Next.js

For Namecheap cPanel, you'll point the startup file to `server.js`. Make sure `server.js` correctly handles the `PORT` environment variable provided by Passenger (cPanel assigns it dynamically).

---

## 📋 Pre-Deployment Checklist

Before deploying, complete these steps:

- [ ] Add `output: "standalone"` to `next.config.mjs` (OR align `server.js` with non-standalone approach)
- [ ] Create MySQL database + user in **cPanel → MySQL Databases**
- [ ] Update `.env` with cPanel-prefixed DB name, user, and actual password
- [ ] Generate a strong random `JWT_SECRET` (64+ chars)
- [ ] Whitelist Namecheap server IP in MongoDB Atlas Network Access
- [ ] Add `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `NODE_ENV=production` to cPanel environment variables
- [ ] Run `npm run build` **locally**
- [ ] Delete the `out/` directory
- [ ] Delete `.DS_Store` files
- [ ] Remove `node_modules` and `.next/cache` before uploading
- [ ] ZIP and upload project files to Namecheap
- [ ] Run `npm install --production` on the server via cPanel
- [ ] Set Node.js version to **18.17+** in cPanel
- [ ] Set startup file to `server.js`
- [ ] Reduce MySQL `connectionLimit` to 3-5
- [ ] Update `.env.example` with `MONGODB_URI` and `MONGODB_DB` placeholders
- [ ] Remove `tlsAllowInvalidCertificates: true` from MongoDB options
- [ ] Add `"engines"` field to `package.json`
- [ ] Change default admin passwords and remove the hint from the login page
