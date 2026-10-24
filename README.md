# itelect4-backend

REST API for the Peer Tutoring platform — **Express + TypeScript + MongoDB (Mongoose) + JWT**.
The frontend is [itelect4-project](https://github.com/haziaintsht/itelect4-project).

## Stack
- **Express 5** — routing, middleware, error handling
- **Mongoose** — MongoDB schemas that mirror the frontend's `User` / `Session` / `Booking` interfaces
- **JWT** — signed tokens from login/register, verified by a `protect` middleware
- **bcryptjs** — passwords stored as hashes, never plain text
- **TypeScript** — strict; import/export at compile time, erased at runtime (Session 2)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI`, `JWT_SECRET` and the two `SEED_TUTOR_*` values
3. `npm run seed` — puts the demo tutor and the tutoring sessions into the database (safe to run again)
4. `npm run dev` → http://localhost:4000 — prints `API on http://localhost:4000` and `MongoDB connected: itelect4`

## Endpoints

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| GET | `/api/health` | public | — |
| POST | `/api/auth/register` | public | `{ name, email, password, role? }` |
| POST | `/api/auth/login` | public | `{ email, password }` |
| GET | `/api/sessions` | public | — |
| GET | `/api/sessions/:id` | public | — |
| POST | `/api/sessions` | Bearer | `{ title, subject, description, sessionType?, meetingLink? }` |
| GET | `/api/bookings` | Bearer | — |
| GET | `/api/bookings/:id` | Bearer | — |
| POST | `/api/bookings` | Bearer | `{ session, note }` |
| PATCH | `/api/bookings/:id` | Bearer | `{ status?, note? }` |
| DELETE | `/api/bookings/:id` | Bearer | — |

## Scripts
- `npm run dev` — `tsx watch src/server.ts` (restarts on save)
- `npm run build` — `tsc` type-checks + emits to `dist/`
- `npm run start` — runs the compiled output
- `npm run seed` — upserts the tutoring sessions in `src/data/sessions.ts`; running it twice changes nothing
- `npm run typecheck` — `tsc --noEmit`

## How it runs

| | On your laptop | On Vercel |
| --- | --- | --- |
| Entry point | `src/server.ts` (calls `app.listen`) | `src/app.ts` (its default export) |
| Database connection | started by `server.ts`, awaited by the middleware | opened by the first request, reused after |
| Config | `.env` | Vercel → Settings → Environment Variables |

There is no `vercel.json`: Vercel finds the Express app in `src/app.ts` by itself.

## Deploy (Vercel)

1. **Atlas → Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`, comment `Vercel`).
   Vercel's addresses change per request, so there is no fixed address to add. Keep your own entry too.
2. Push to GitHub. On vercel.com: **Add New → Project → Import** `itelect4-backend`.
   Root Directory `./`, preset **Express**.
3. Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CORS_ORIGIN`.
   `CORS_ORIGIN` starts as `http://localhost:3000` until the frontend is deployed, then becomes the
   frontend's `https://<name>.vercel.app` (no trailing slash) — redeploy after changing it.
   Do not add `PORT`, and do not press Add beside MongoDB Atlas.
4. Deploy. The preview says `No route for GET /` — that is this app's own 404, so the app is running.
5. Open `https://<backend>.vercel.app/api/health`. It must answer `{"ok":true,"db":true}`.
   `db: false` (or a 500) means the Atlas access list or `MONGODB_URI` is wrong.
