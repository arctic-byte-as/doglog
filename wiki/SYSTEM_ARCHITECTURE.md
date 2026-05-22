# System Architecture

## Recommended Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes / Server Actions

### Database
- PostgreSQL
- Prisma ORM

### Hosting
- Vercel
- Supabase

---

# Architecture Principles

1. Prefer simplicity over cleverness
2. Keep business logic separate from UI
3. Use typed APIs
4. Keep components small
5. Avoid premature abstractions
6. Mobile-first design
7. Accessibility by default
8. Minimize dependencies

---

# Suggested Folder Structure

/app
/components
/features
/lib
/server
/prisma
/docs
/tests

---

# Future Considerations

Only introduce:
- queues
- AI systems
- event systems
- caching layers
- analytics pipelines

when actual scaling problems exist.
