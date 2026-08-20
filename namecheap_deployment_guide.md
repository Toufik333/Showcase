# 🚀 Deploy Your Website on Namecheap — Beginner Guide

> **Your ZIP file:** [namecheap-deploy.zip](file:///s:/Installed%20Apps/Xampp%20installs%20here/htdocs/deployment/namecheap-deploy.zip) (1.74 MB)
>
> This ZIP has your pre-built website code. It does **NOT** include `node_modules` or `.env` — you'll set those up on the server.

---

## Step 1: Open cPanel

cPanel is the control panel for your hosting. It's where you manage everything.

1. Open your browser and go to **[namecheap.com](https://namecheap.com)**
2. Click **"Sign In"** (top right) → log in with your Namecheap account
3. You'll land on your **Dashboard**
4. Find your hosting plan in the list → click the **"Manage"** button next to it
5. On the hosting management page, look for a button that says **"Go to cPanel"** → click it
6. cPanel will open in a new tab — this is your hosting control panel

> [!TIP]
> You can also access cPanel directly by visiting: `https://yourdomain.com:2083` or `https://yourdomain.com/cpanel` in your browser.

---

## Step 2: Create a MySQL Database

Your website uses a MySQL database to store money tracker data, shop products, and orders. You need to create one.

1. You're now in cPanel. You'll see many icons/sections on the page
2. Find the search bar at the top of cPanel → type **"MySQL"**
3. Click on **"MySQL Database Wizard"** (this is the easiest way)

**The wizard has 3 steps:**

**Wizard Step 1 — Create a Database:**
- It will ask for a database name
- Type: `money_tracker`
- cPanel will automatically add your username prefix, so it becomes something like: `youruser_money_tracker`
- **Write this full name down on paper** (e.g., `youruser_money_tracker`)
- Click **"Next Step"**

**Wizard Step 2 — Create a Database User:**
- Enter a username (e.g., `dbuser`)
- Enter a **strong password** (use the password generator if you want)
- **Write down the full username and password on paper** (e.g., `youruser_dbuser` and the password)
- Click **"Create User"**

**Wizard Step 3 — Add User to Database:**
- Check the box that says **"ALL PRIVILEGES"**
- Click **"Next Step"** or **"Make Changes"**
- Done! Click **"Return to Home"** to go back to cPanel main page

---

## Step 3: Import the Database Tables

Your website needs specific tables (users, products, orders, etc.). The `schema.sql` file creates these tables. You need to import it.

1. First, **extract the `namecheap-deploy.zip`** on your computer (right-click → Extract All)
2. Find the file called `schema.sql` inside the extracted folder — you'll upload this soon
3. Go back to cPanel in your browser
4. In the cPanel search bar, type **"phpMyAdmin"** → click on it
5. phpMyAdmin will open in a new tab
6. On the **left sidebar**, click on your database name (e.g., `youruser_money_tracker`)
7. Click the **"Import"** tab at the top of the page
8. Click **"Choose File"** → find and select the `schema.sql` file from your extracted ZIP
9. Leave all other settings as default
10. Scroll down and click **"Go"**
11. You should see a green message: **"Import has been successfully finished"**
12. Close the phpMyAdmin tab

---

## Step 4: Upload Your Website Files

Now you'll upload the ZIP file to your hosting.

1. Go back to cPanel
2. In the cPanel search bar, type **"File Manager"** → click on it
3. File Manager will open — it shows all files on your hosting
4. In the left sidebar, click on **`public_html`** to navigate into that folder
   - This is the folder where your main website files go
5. If there's a default `index.html` file already there → **right-click it → Delete** (confirm if asked)
6. Now click the **"Upload"** button in the top toolbar
7. A new upload page opens → click **"Select File"** → choose your `namecheap-deploy.zip` file
8. Wait for the upload to finish (the progress bar will reach 100%)
9. Click **"Go Back to..."** (the link at the bottom) to return to File Manager
10. You should now see `namecheap-deploy.zip` inside `public_html`
11. **Right-click** on `namecheap-deploy.zip` → click **"Extract"**
12. A popup appears asking where to extract → make sure it says `/public_html` → click **"Extract Files"**
13. Click **"Close"** when it's done
14. You should now see all your files: `server.js`, `package.json`, `.next/`, `src/`, etc.
15. **Delete the ZIP file** (right-click `namecheap-deploy.zip` → Delete) to save disk space

> [!IMPORTANT]
> Double-check that `server.js` is located at `/public_html/server.js` — NOT inside a subfolder like `/public_html/deployment/server.js`. If the files extracted into a subfolder, move them up to `public_html`.

---

## Step 5: Create Your `.env` File

The `.env` file contains your secret passwords and database connection info. You skipped including it in the ZIP (which is correct — secrets should never be in a ZIP).

1. In File Manager, make sure you're inside the `public_html` folder
2. Click the **"+ File"** button in the top toolbar
3. Type `.env` as the filename → click **"Create New File"**
4. Find the new `.env` file in the file list → **right-click** it → click **"Edit"**
5. If a popup asks about encoding, just click **"Edit"**
6. Paste this template and **replace the placeholder values with your actual info**:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=youruser_dbuser
DB_PASSWORD=your_actual_password_from_step2
DB_NAME=youruser_money_tracker
DB_SSL=false

JWT_SECRET=paste-a-long-random-string-here

MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB=notes_app
```

**How to fill in each value:**
- `DB_USER` → The full database username from Step 2 (e.g., `youruser_dbuser`)
- `DB_PASSWORD` → The database password from Step 2
- `DB_NAME` → The full database name from Step 2 (e.g., `youruser_money_tracker`)
- `JWT_SECRET` → Any long random text (at least 64 characters). You can mash your keyboard or use a password generator
- `MONGODB_URI` → Your MongoDB Atlas connection string (you already have this from your local `.env`)
- `MONGODB_DB` → Keep it as `notes_app`

7. Click **"Save Changes"** (top right) → then click **"Close"**

---

## Step 6: Set Up the Node.js App

This tells Namecheap to actually run your website using Node.js.

1. Go back to cPanel home (click the cPanel logo at the top left)
2. In the search bar, type **"Node.js"** → click on **"Setup Node.js App"**
3. Click the **"+ Create Application"** button (top right, blue button)
4. Fill in the form exactly like this:

| Setting | What to select/type |
|---------|-------------------|
| **Node.js version** | Pick **18.x** or **20.x** (any version 18 or above) |
| **Application mode** | Select **Production** |
| **Application root** | Type: `public_html` |
| **Application URL** | Leave as your domain (it auto-fills) |
| **Application startup file** | Type: `server.js` |

5. Click **"Create"** (blue button)
6. The app is now created! You'll see a green success message and your app's management page

---

## Step 7: Install Dependencies (npm install)

Now you need to install the packages your website depends on (like Next.js, React, MongoDB driver, etc.).

1. After creating the app in Step 6, you should still be on the app management page
2. At the very top of the page, you'll see a **command that starts with**: 
   ```
   source /home/youruser/nodevenv/public_html/...
   ```
3. There's a **"Run NPM Install"** button on the page → **click it**
4. Wait for it to finish — this may take 1-3 minutes
5. You'll see output showing packages being installed. When it's done, you'll see a success message

> [!NOTE]
> This is doing the same thing as running `npm install` on your own computer. It downloads all the packages listed in `package.json` and creates the `node_modules` folder on the server.

---

## Step 8: Add Environment Variables in the Node.js App

This is an extra way to make sure the server picks up your settings. Some hosting setups need this in addition to the `.env` file.

1. On the same app management page from Step 6, scroll down until you see **"Environment variables"**
2. Click **"Add Variable"** and add these one at a time:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |

3. Click **"Save"** (the blue button at the top of the page)

> [!TIP]
> The `NODE_ENV=production` variable is the most important one. The rest are already in your `.env` file. But if your app doesn't read the `.env` properly, come back here and add all the other variables too (DB_HOST, DB_USER, etc.).

---

## Step 9: Whitelist Your Server IP in MongoDB Atlas

Your Notes app connects to MongoDB Atlas (a cloud database). Atlas blocks connections from unknown IP addresses. You need to tell Atlas to allow your Namecheap server.

1. Go to **[cloud.mongodb.com](https://cloud.mongodb.com)** → log in to your MongoDB Atlas account
2. On the left sidebar, click **"Network Access"** (under the Security section)
3. Click the green **"+ Add IP Address"** button
4. In the popup, you have two choices:
   - **Easy option:** Click **"Allow Access from Anywhere"** → this enters `0.0.0.0/0` which allows any IP
   - **Secure option:** Find your Namecheap server's IP address (check your hosting account details or cPanel → "Server Information") and enter just that IP
5. Click **"Confirm"**
6. Wait about 1 minute for the change to take effect

---

## Step 10: Start Your Website

1. Go back to cPanel → search for **"Setup Node.js App"** → click on it
2. Find your app in the list
3. Click the **"Restart"** button (it looks like a circular arrow ↻)
4. Wait about 15 seconds

---

## Step 11: Visit Your Website! 🎉

Open a new browser tab and try these links (replace `yourdomain.com` with your actual domain):

| Page | URL |
|------|-----|
| **Homepage** | `https://yourdomain.com` |
| **Notes App** | `https://yourdomain.com/notes` |
| **Money Tracker** | `https://yourdomain.com/tracker` |
| **Shop** | `https://yourdomain.com/shop` |
| **Shop Admin** | `https://yourdomain.com/shop/admin/login` |

If everything loads, congratulations — your website is live! 🥳

---

## ❓ Something Not Working?

### "502 Bad Gateway" or "503 Service Unavailable"
- Go to cPanel → Setup Node.js App → click **Restart**
- Make sure the startup file is set to `server.js`
- Make sure Node.js version is 18 or higher

### The website shows a Namecheap default/parking page
- In File Manager, check that your files are directly inside `public_html/`, not in a subfolder
- Delete any `index.html` that Namecheap put there

### Notes app shows errors or won't save
- You probably haven't whitelisted your server IP in MongoDB Atlas (Step 9)
- Double-check that `MONGODB_URI` in your `.env` file is correct

### Money Tracker or Shop not working
- Check that your database name in `.env` matches exactly what cPanel created (with the username prefix)
- Make sure you imported `schema.sql` in phpMyAdmin (Step 3)
- Verify the DB password in `.env` matches what you set in Step 2

### How to see error messages
- In cPanel, search for **"Errors"** → click on it → shows recent error logs
- In File Manager, look for a file called `stderr.log` in your `public_html` folder

### Need to update your website later?
1. Make your code changes on your local computer
2. Run `npm run build` locally
3. Ask me to create a new ZIP
4. In cPanel File Manager, delete the old `.next/` folder and `src/` folder
5. Upload the new ZIP → Extract → overwrite
6. Go to Setup Node.js App → click **Restart**
7. (You do NOT need to run npm install again unless you added new packages)
