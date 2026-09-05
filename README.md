# VIMASHO — Men's Ethnic Wear (Full MERN E-Commerce App)

A full-stack e-commerce site built to match the VIMASHO brand mark: deep forest green + gold,
serif display type, a restrained gold divider motif. Built on **MongoDB, Express, React, Node (MERN)**.

Nothing in the frontend is hardcoded — every product, category, price, cart, wishlist and order comes
from the API/database. The `seed` script only exists to populate your database with a starter catalog
so the site isn't empty on first run; you can delete it or replace it with your real catalog via the
Admin Panel.

## What's included

- **Auth**: JWT register/login, profile, saved addresses
- **Catalog**: categories, products with color/size variants, stock tracking, filters (category, fit,
  occasion, size, color, price), sorting, search, pagination, ratings & reviews
- **Cart & Wishlist**: server-side, per logged-in user
- **Checkout**: address selection, server-verified pricing & stock, **Razorpay** payment integration
  (order creation + signature verification)
- **Orders**: order history, status tracking
- **Admin Panel**: dashboard metrics, product CRUD (with image upload and variant/size/stock builder),
  category CRUD, order status management

## Project structure

```
vimasho/
  server/     Express + MongoDB API
  client/     React + Vite + Tailwind frontend
```

---

## 1. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local MongoDB, or a free MongoDB Atlas cluster)
- A Razorpay account (test mode is free) → https://dashboard.razorpay.com/signup

### Backend

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/vimasho?retryWrites=true&w=majority
JWT_SECRET=<any long random string>
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

Get your Razorpay **test** keys from Dashboard → Settings → API Keys.

```bash
npm install
npm run seed      # populates categories, a starter catalog, and an admin + demo user
npm run dev       # starts the API on http://localhost:5000
```

Seeded logins:
- **Admin**: `admin@vimasho.com` / `Admin@12345`
- **Demo customer**: `demo@vimasho.com` / `Demo@12345`

### Frontend

```bash
cd client
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm install
npm run dev       # starts the site on http://localhost:5173
```

Visit `http://localhost:5173`. Sign in as admin and go to `/admin` to manage products, categories, and
orders — or add your own real product photography and copy through the Admin Panel's "Add Product" form.

---

## 2. Payments (Razorpay) — going live

The app ships wired to **Razorpay test mode**, which uses fake cards and never touches real money.
Test card: `4111 1111 1111 1111`, any future expiry, any CVV, any OTP.

To accept real payments:
1. Complete Razorpay KYC/activation for your business.
2. Switch `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in the server's `.env` to your **live** keys.
3. Nothing else changes — the same `/api/payment/razorpay/order` and `/verify` endpoints work in live mode.

---

## 3. Deploying (MongoDB Atlas + Render + Vercel)

### MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Add a database user and allow network access from `0.0.0.0/0` (or Render's IPs)
3. Copy the connection string into `MONGO_URI`

### Backend → Render
1. Push this repo to GitHub
2. On https://render.com → New → Web Service → connect the repo, root directory `server`
3. Build command: `npm install`  ·  Start command: `npm start`
4. Add environment variables from `server/.env.example` (with your real values)
5. After the first deploy, open the Render **Shell** tab and run `npm run seed` once (optional)
6. Note your Render URL, e.g. `https://vimasho-api.onrender.com`

### Frontend → Vercel
1. On https://vercel.com → New Project → import the repo, root directory `client`
2. Framework preset: Vite
3. Environment variable: `VITE_API_URL=https://vimasho-api.onrender.com/api`
4. Deploy

### Final step
Back in Render, set `CLIENT_URL` to your Vercel URL (e.g. `https://vimasho.vercel.app`) so CORS allows it,
and redeploy the backend.

---

## 4. Notes on the "no hardcoding" requirement

- Every page fetches live data via `axios` from the Express API — there are no static product/category
  arrays in the React code.
- The `server/seed/data.js` file is **only** used by the one-time `npm run seed` script to populate your
  database for a working demo. Replace or clear it any time via the Admin Panel — the frontend doesn't
  know or care where the data came from.
- Product images in the seed data use placeholder URLs (`placehold.co`) so the demo works out of the box.
  Replace them with real photography through the Admin product form's image upload.

## Tech stack

- **Frontend**: React 18, React Router 6, Tailwind CSS, Axios, react-hot-toast, react-icons
- **Backend**: Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer, Razorpay SDK
- **Database**: MongoDB
