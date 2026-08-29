# itelect4-backend

REST API for the Peer Tutoring platform — **Express + TypeScript + MongoDB (Mongoose) + JWT**.

## Stack
- **Express 5** — routing, middleware, error handling
- **Mongoose** — MongoDB schemas that mirror the frontend's `User` / `Session` / `Booking` interfaces
- **JWT** — signed tokens from login/register, verified by a `protect` middleware
- **bcryptjs** — passwords stored as hashes, never plain text
- **TypeScript** — strict; import/export at compile time, erased at runtime (Session 2)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`
3. `npm run dev` → http://localhost:4000

## Endpoints

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
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
- `npm run dev` — `tsx watch` (restarts on save)
- `npm run build` — `tsc` type-checks + emits to `dist/`
- `npm run start` — runs the compiled output

## Deploy
Push to GitHub, import the repo in Vercel, add `MONGODB_URI` and `JWT_SECRET`
as environment variables (never in `.env` in git), and deploy.