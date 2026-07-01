# MIA Automotive

A modern, premium car sales website for **MIA Automotive** — browse stock, filter like AutoTrader, view full vehicle details and enquire by form, call or WhatsApp. Includes a simple, clean admin dashboard to manage stock and enquiries.

> **No finance, by design.** There are deliberately no monthly payments, PCP/HP calculators or finance applications anywhere. The conversion goal is **enquiry** (call / WhatsApp / email / contact form).

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, **Framer Motion** for animation, **lucide-react** icons
- **Prisma** ORM with **Supabase Postgres**
- **Vercel Blob** for car image uploads (falls back to `/public/uploads` locally)
- **jose** for signed admin session cookies (cookie-based auth + route middleware)

> **Deploying?** See **[DEPLOY.md](DEPLOY.md)** for the full Supabase + Vercel walkthrough.

## Features

### Customer-facing
- **Home** — luxury hero with quick search (make, model, max price, year, mileage), featured stock, "why choose us", testimonials and contact CTAs.
- **Current Stock** — AutoTrader-style filtering (make, model, year, mileage, price, fuel, transmission, body, colour, doors, engine, availability) with live results (no page reload, debounced + URL-synced), sorting, loading skeletons, empty & error states.
- **Car detail** — image gallery + lightbox, key specs, description, features, condition notes, full details table, enquiry form, call/WhatsApp buttons, similar cars.
- **Contact** — form, phone, email, address, map placeholder, opening hours, WhatsApp.
- Fully responsive, mobile-first, with a persistent WhatsApp/call shortcut.

### Admin (`/admin`)
- Password login (cookie session, middleware-protected).
- Dashboard with stock stats and a management table.
- Add / edit / delete cars, mark **available / reserved / sold**, toggle **featured**.
- Multiple image upload with drag-to-reorder and **choose main image**.
- All vehicle fields: make, model, variant, year, reg/plate, mileage, price, fuel, transmission, body, colour, doors, engine, ULEZ, MOT, previous owners, service history, description, features, condition notes, status.
- Enquiries inbox with read / archive / delete and reply shortcuts.

## Getting started

You need a Postgres database (Supabase — free). Create one and put its connection
strings in `.env` as `DATABASE_URL` (pooled, 6543) and `DIRECT_URL` (direct, 5432) —
see **[DEPLOY.md](DEPLOY.md) step 1** for exactly where to find them.

```bash
npm install            # installs deps + generates Prisma client
npm run db:push        # create the tables in your Supabase database
npm run db:seed        # load demo stock + sample enquiries (optional)
npm run dev            # http://localhost:3000
```

Already set up? Just `npm run dev`. To wipe and reseed: `npm run db:reset`.

### Admin login
Go to **/admin** → redirected to **/admin/login**.
Default password: `mia-admin-2026` (set `ADMIN_PASSWORD` in `.env`).

## Configuration (`.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase **pooled** connection (port 6543) — used at runtime. |
| `DIRECT_URL` | Supabase **direct** connection (port 5432) — used by `prisma db push`. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (auto-set on Vercel). Blank locally = uploads save to `/public/uploads`. |
| `ADMIN_PASSWORD` | Admin login password. **Change before deploying.** |
| `AUTH_SECRET` | Secret used to sign the session cookie. Use a long random string in prod. |
| `NEXT_PUBLIC_SITE_NAME` / `_PHONE` / `_WHATSAPP` / `_EMAIL` / `_ADDRESS` | Business details shown across the site. `_WHATSAPP` is digits only, incl. country code (e.g. `447000000000`). |

## Data model

`Car` ← `CarImage` (with `isMain`/`order`), `Feature`, `Enquiry` (optionally linked to a car). See [`prisma/schema.prisma`](prisma/schema.prisma).

## Project structure

```
src/
  app/
    (public)/            # customer site (Navbar/Footer layout)
      page.tsx           # home
      inventory/         # stock + live filters
      cars/[id]/         # car detail
      contact/
    admin/
      login/
      (dashboard)/       # protected shell: dashboard, cars/new, cars/[id]/edit, enquiries
    api/                 # cars, enquiries, upload, auth
  components/            # UI + admin + inventory components
  lib/                   # prisma, auth, cars query/filter, constants, utils, validation
  middleware.ts          # protects /admin/*
```

## Production notes

The app is configured for **Vercel + Supabase Postgres + Vercel Blob** — see
**[DEPLOY.md](DEPLOY.md)**. Key points:

- **Database:** Supabase Postgres via Prisma (pooled `DATABASE_URL`, direct `DIRECT_URL`).
- **Images:** uploaded to Vercel Blob in production; locally they fall back to
  `/public/uploads` when no `BLOB_READ_WRITE_TOKEN` is set — so dev needs zero setup.
- Set a strong `AUTH_SECRET` and `ADMIN_PASSWORD` in the Vercel environment.
