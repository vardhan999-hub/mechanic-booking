# Mechanic Booking System

This is the Feature Complete CRUD module I built for ticket ENG-159184 — a digital replacement
for the paper/Excel booking process the mechanic shop staff were using before.

**Live:** https://mechanic-booking.vercel.app/bookings

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Zustand for state
- Supabase (Postgres) for the database
- DOMPurify for sanitizing text inputs

## What's in here

- Full CRUD — create, view, edit, delete bookings
- Empty state instead of a blank screen when there's no data
- Loading spinners on async calls, plus a proper error message if the network drops
- Form validation — required fields, a vehicle registration format check, and it won't let you
  pick a date in the past. Errors highlight in red.
- Accessibility — ARIA labels on everything interactive, keyboard nav works, screen reader
  friendly table
- Console logs a `[Analytics]` line whenever someone creates/updates/deletes/navigates, per the
  telemetry requirement in the TRD
- Basic role check (staff vs manager) before any create/update/delete goes through.
- Database operations are performed through secure Next.js API routes using the Supabase Service
  Role key, which is never exposed to the browser.

## Running it locally

```bash
npm install
```

You'll need a `.env.local` in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Run `supabase-setup.sql` in your Supabase SQL editor first to create the table and seed a few
rows, then:

```bash
npm run dev
```

Goes to `localhost:3000`, redirects to `/bookings`.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint
- `npm run start` — run the production build

## Folder layout

```
src/
├── app/
│   ├── layout.tsx, globals.css, page.tsx
│   ├── api/bookings/            # GET/POST, PUT/DELETE by id
│   └── bookings/                # list, new, edit pages
├── components/                  # BookingForm, StatusIndicators
├── store/                       # bookingStore.ts (Zustand)
└── lib/                         # types, sanitize, analytics, authorization, supabase client
```

## A note on authorization

The TRD asks for "proper authorization checks." Since there's no user login system in scope for
this ticket, I went with a role-gate in `src/lib/authorization.ts` that checks permissions before
any mutating action fires. If this project were extended with authentication, the next step
would be to store user roles in a `profiles` table and enforce permissions through Supabase Row
Level Security (RLS). For this assignment, authorization is implemented at the application layer
because user authentication was not part of the project scope.

## API

The frontend never communicates directly with Supabase.

All database operations go through secure Next.js API routes:

- `GET /api/bookings`
- `POST /api/bookings`
- `PUT /api/bookings/[id]`
- `DELETE /api/bookings/[id]`

These routes perform all CRUD operations using the server-side Supabase client, so the Service
Role key stays on the server and is never sent to the browser.

## Why Supabase and not just a JSON file

Started out with a local `db.json` + json-server setup like the earlier capstone projects. Worked
fine locally, but broke on Vercel because serverless functions there run on a read-only
filesystem — writes just silently failed in production. Swapped to Supabase since it's already
part of the stack from VaultPay.
