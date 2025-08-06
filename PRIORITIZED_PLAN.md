# Hanger-On – Prioritized Roadmap

> Living document capturing the high-level epics, sprint sequencing, and next actions still outstanding after recent fixes.

---

## ✨ Epic-Level Priorities (ranked)

1. **GarmentService + Garment API (CRUD)**  
   Implement full persistence layer (Prisma → Supabase) and REST endpoints (`/api/garments`, `/api/garments/[id]`).
2. **Wire Home UI to Live API**  
   Replace mock state in `app/page.tsx` with SWR/fetch logic; ensure quick-action buttons call the new endpoints.
3. **Tag Management**  
   Finish tag creation logic (`TagInput.tsx`) and CRUD API (`/api/tags`).
4. **User Profile Update Flow**  
   Connect `/account/edit` form to PATCH `/api/user/profile` (to be added) and Supabase Auth metadata.
5. **Image Upload Pipeline**  
   Hook `ImageUpload.tsx` → Supabase Storage; enable crop & resize before upload.
6. **Testing & CI**  
   Vitest + React Testing Library + GitHub Actions; target ≥80 % coverage.
7. **Vercel Deployment & Env Config**  
   Auto-deploy from `main`, staging/production env vars, health checks.
8. **Accessibility & Final UI Polish**  
   ARIA labels, axe-core audits, responsive QA.

> **Note:** `.next`-folder TODOs (Babel, webpack placeholders) are build artifacts and can be ignored.

---

## 🗓 Draft Sprint Sequencing

| Sprint | Focus | Key Exit Criteria |
|--------|-------|-------------------|
| **Week 1** | Foundation & Auth | Prisma schema synced; Supabase RLS policies in place; NextAuth working. |
| **Week 2** | Garment API + Home Wiring | CRUD endpoints pass integration tests; Home page loads live garments. |
| **Week 3** | Tags & Images | Tag CRUD functional; image upload & display end-to-end. |
| **Week 4** | Testing + CI/CD | 80 % test coverage; GitHub Actions green; Vercel staging live. |
| **Week 5** | Accessibility & Polish | axe-core score ≥ 90; performance audit passes; final UI QA. |

Adjust sprint length as needed (estimates assume ~10 h/week part-time).

---

## ✅ Immediate Next Steps

1. **Database & Service Layer**  
   • Flesh out `GarmentService` methods (`getAllGarments`, `createGarment`, etc.).  
   • Scaffold Prisma models for garments/tags/images.  
   • Write migrations (`prisma migrate dev`).
2. **API Routes**  
   • Implement logic inside `app/api/garments/route.ts` and `[id]/route.ts` using `GarmentService`.  
   • Add Zod validation for request/response.
3. **Home Page Integration**  
   • Replace `useState` mock array with SWR hook fetching `/api/garments`.  
   • Update quick actions to call `PUT /api/garments/[id]` for status changes.
4. **TagInput Logic**  
   • Connect `onAddTag` to `POST /api/tags`; update local SWR cache.
5. **Write Unit Tests** (GarmentService + API) _in parallel_ to lock down contract.

---

## 📌 Reference Docs

* `BUILD_PLAN.md` – dependency alignment & deployment notes.  
* `tasks.md` – granular checklist with time estimates.  
* `COMPLETED_ACTIONS.md` – history of merged work.

---

_Last updated: {{TODO-replace-with-date}}_