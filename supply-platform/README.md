# التوريد العالمي — Supply Sourcing Platform

منصة RFQ (طلبات توريد) تربط العملاء بفريق توريد يراجع كل طلب، يرسل عرض سعر،
ويتابعه حتى التسليم — لأي فئة تقريبًا من المنتجات أو الخدمات.

Independent Next.js + Prisma/PostgreSQL project, unrelated to `../web` (نخبة
التداول) or `../indicators` (TradingView indicator) elsewhere in this repo.

## Stack

- Next.js 16 (App Router, Turbopack)
- Prisma 7 + PostgreSQL (via `@prisma/adapter-pg`)
- Tailwind CSS 4
- `jose` for signed JWT sessions, `bcryptjs` for password hashing
- `zod` for input validation

## Core features

- Public landing page: how it works, supported categories, legal restrictions
- Customer registration/login. The account matching `ADMIN_EMAIL` is
  auto-promoted to `ADMIN` on first registration.
- "New supply request" form open to any category (electronics, industrial
  equipment, raw materials, services, ...), with quantity, budget, and
  deadline
- Mandatory legal gate: an explicit list of prohibited categories (weapons,
  drugs, human trafficking, counterfeit/stolen goods, endangered species,
  hazardous materials, sanctions violations) plus a required declaration
  checkbox before a request can be submitted
- Admin dashboard: stats overview, request list filterable by status, send
  quotes, mark a request fulfilled, and a "reject — illegal" action with a
  reason shown to the customer
- Per-request message log between customer and admin
- Customer can accept or decline a quote from their own dashboard

## Getting started

```bash
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL
npm install
npx prisma migrate deploy
npm run dev
```

The first account registered with the email in `ADMIN_EMAIL` becomes an
admin automatically; every other registration is a regular customer.
