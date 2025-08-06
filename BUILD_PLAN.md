# Build & Deployment Roadmap

> Tailored for personal usage (2–3 users) with manual Vercel deployment and Supabase backend

---

## 1 Dependency Alignment

1. Pin stable, production-ready versions to avoid canary instability.
   ```bash
   npm i next@14 react@18 react-dom@18 -E
   ```
2. Remove the caret (`^`) from critical packages in `package.json` to keep builds reproducible.

---

## 2 Helpful NPM Scripts

Add the following scripts to `package.json`:

```jsonc
"scripts": {
  // …existing scripts…
  "type-check": "tsc --noEmit",
  "test": "vitest run",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate deploy"
}
```

---

## 3 Local Verification Pipeline

Run these commands before each commit/push:

```bash
npm install              # first-time / after lock updates
npm run lint             # ESLint static analysis
npm run type-check       # TypeScript compile check
npm run prisma:generate  # Ensure Prisma client is generated
npm run build:safe       # Production build with safe flags
```

A green `build:safe` means you are ready to deploy.

---

## 4 Environment Variables (Vercel Dashboard)

| Variable            | Purpose                    |
|---------------------|----------------------------|
| `DATABASE_URL`      | Prisma adapter             |
| `NEXTAUTH_URL`      | NextAuth callback URL      |
| `NEXTAUTH_SECRET`   | NextAuth session signing   |
| `SUPABASE_URL`      | Supabase project URL       |
| `SUPABASE_ANON_KEY` | Supabase anon key (public) |

---

## 5 Security Notes (Low-Traffic Personal App)

* Keep default NextAuth behavior (JWT sessions).
* Supabase Row-Level Security may remain disabled if desired.
* No rate-limiting necessary for 2–3 users.

---

## 6 Manual Deployment on Vercel

1. Push to GitHub `main` (or chosen branch).
2. In Vercel, **Import Project** → Framework: **Next.js**.
3. Add the environment variables listed above.
4. Trigger the production build. A successful build auto-deploys.

---

## 7 Next Steps

* Implement version pinning & script additions.
* Run the verification pipeline; fix any lint/type errors until `build:safe` succeeds.
* Once build is green, deploy via Vercel.

---

*Document generated automatically to guide development & deployment.*