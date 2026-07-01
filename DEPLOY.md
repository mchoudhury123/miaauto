# Deploying MIA Automotive to Vercel

The app uses **Supabase Postgres** for data and **Vercel Blob** for car photos.
Follow these steps once; after that, every `git push` auto-deploys.

---

## 1. Create the database (Supabase)

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick a region close
   to your customers (e.g. London / `eu-west-2`). Save the database password.
2. Open **Project → Settings → Database → Connection string → "URI"** and copy the
   two you need:
   - **Transaction pooler** (port **6543**) → this is your `DATABASE_URL`
   - **Session / direct** (port **5432**) → this is your `DIRECT_URL`
3. Put them in your local `.env` (append `?pgbouncer=true&connection_limit=1` to the
   pooled one):

   ```
   DATABASE_URL="postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
   ```

## 2. Create the tables + (optional) demo data

From the project folder:

```bash
npx prisma db push     # creates all tables in Supabase
npm run db:seed        # OPTIONAL: loads the 5 demo cars + sample enquiries
```

Then `npm run dev` — the local site now runs on Supabase, identical to production.
(Skip `db:seed` if you'd rather start empty and add cars via the admin.)

## 3. Push the code to GitHub

Create a repo and push. **Do not commit `.env`** (it's already git-ignored).

## 4. Import into Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
2. Framework preset: **Next.js** (auto-detected). Leave build settings default.
3. Before the first deploy, add **Environment Variables** (Project → Settings →
   Environment Variables) — copy these from your `.env`:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | the pooled (6543) Supabase URL |
   | `DIRECT_URL` | the direct (5432) Supabase URL |
   | `ADMIN_PASSWORD` | **a new strong password** |
   | `AUTH_SECRET` | **a long random string** (e.g. run `openssl rand -base64 32`) |
   | `NEXT_PUBLIC_SITE_NAME` | MIA Automotive |
   | `NEXT_PUBLIC_PHONE` | your real number |
   | `NEXT_PUBLIC_WHATSAPP` | digits only, e.g. `447…` |
   | `NEXT_PUBLIC_EMAIL` | your real email |
   | `NEXT_PUBLIC_ADDRESS` | your address |
   | `NEXT_PUBLIC_INSTAGRAM` | your Instagram URL |

## 5. Turn on image storage (Vercel Blob)

1. In the Vercel project → **Storage → Create → Blob**.
2. Connect it to the project. Vercel automatically adds `BLOB_READ_WRITE_TOKEN`
   to the environment — no manual step needed.
3. Redeploy (Deployments → ⋯ → Redeploy) so the new variable takes effect.

> Until the Blob store exists, admin photo uploads will fail in production
> (there's no writable disk on Vercel). Locally, uploads still work — they save
> to `/public/uploads` because no Blob token is set.

## 6. Deploy 🚀

Click **Deploy**. When it finishes, visit the URL, then `/admin` to log in with the
`ADMIN_PASSWORD` you set. Add cars, upload photos, done.

---

## Day-to-day

- **Add/edit stock:** just use `/admin` on the live site.
- **Change the schema later:** edit `prisma/schema.prisma`, then run
  `npx prisma db push` locally (it targets Supabase via `DIRECT_URL`).
- **Back-ups:** Supabase takes automatic backups; you can also download one from
  the Supabase dashboard.

## Notes

- Local and production share one Supabase database here (simplest). If you later
  want them separate, create a second Supabase project and use its URLs as the
  Vercel env vars (keep the first for local `.env`).
- The build runs `prisma generate` automatically; you do **not** need to run
  migrations on Vercel.
