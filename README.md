# doglog

A lightweight trainer dashboard prototype for dog behaviour logging and consultation tracking.

## Prototype overview

- Next.js + TypeScript + Tailwind CSS prototype UI
- Dashboard, dog profiles, consultations, and demo login flow
- Owner registration creates live customer and dog records in the local database
- Prisma schema scaffold included for next-stage database integration

## Run locally

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open http://localhost:3000

## Notes

- Customer and dog data should be created through the owner registration flow
- `prisma/schema.prisma` is included as a starting data model for Postgres
- The UI is intentionally simple and demo-ready for founder review
