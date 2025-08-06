# Implementation Guide

> Hands-on steps to deliver each prioritized epic, starting with Garment CRUD.

---

## 1️⃣ GarmentService + Garment API (CRUD)

### 1. Prisma Schema
1. Open `prisma/schema.prisma`  
2. Add a `Garment` model:
   ```prisma
   model Garment {
     id          String   @id @default(uuid())
     userId      String   // Supabase Auth UID (FK via @@index later)
     name        String
     status      String   @default("Clean") // Clean | Worn | Worn 2x | Dirty
     tags        Tag[]    @relation("GarmentTags")
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   model Tag {
     id        String    @id @default(uuid())
     userId    String
     label     String
     garments  Garment[] @relation("GarmentTags")
   }
   ```
3. Run migration:
   ```bash
   npx prisma migrate dev --name init-garments
   npx prisma generate
   ```

### 2. Service Layer (`lib/services/GarmentService.ts`)
* Inject Prisma client (import from `lib/db`)
* Implement:
  ```ts
  export class GarmentService {
    async getAllGarments(userId: string) {
      return prisma.garment.findMany({ where: { userId }, include: { tags: true } });
    }
    async getGarmentById(id: string, userId: string) {
      return prisma.garment.findFirst({ where: { id, userId }, include: { tags: true } });
    }
    async createGarment(data: CreateGarmentInput, userId: string) {
      return prisma.garment.create({ data: { ...data, userId } });
    }
    async updateGarment(id: string, data: UpdateGarmentInput, userId: string) {
      return prisma.garment.update({ where: { id_userId: { id, userId } }, data });
    }
    async deleteGarment(id: string, userId: string) {
      return prisma.garment.delete({ where: { id_userId: { id, userId } } });
    }
  }
  ```
* Export singleton: `export const garmentService = new GarmentService();`

### 3. Validation Schemas (`lib/validation/schemas.ts`)
```ts
export const CreateGarmentSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["Clean", "Worn", "Worn 2x", "Dirty"]).default("Clean"),
  tagIds: z.array(z.string()).optional(),
});
export const UpdateGarmentSchema = CreateGarmentSchema.partial();
```

### 4. API Routes
* **`app/api/garments/route.ts`**
  ```ts
  import { garmentService } from "@/lib/services/GarmentService";
  import { CreateGarmentSchema } from "@/lib/validation/schemas";
  import { getUserId } from "@/lib/auth";

  export async function GET() {
    const userId = await getUserId();
    const garments = await garmentService.getAllGarments(userId);
    return NextResponse.json(garments);
  }
  export async function POST(req: Request) {
    const userId = await getUserId();
    const body = await req.json();
    const data = CreateGarmentSchema.parse(body);
    const created = await garmentService.createGarment(data, userId);
    return NextResponse.json(created, { status: 201 });
  }
  ```
* **`app/api/garments/[id]/route.ts`** → implement GET, PUT, DELETE using `UpdateGarmentSchema`.

### 5. Row-Level Security (Supabase)
* In Supabase SQL editor:
  ```sql
  create policy "Users can read their garments" on public.Garment
    for select using ( auth.uid() = userId );
  create policy "Users can write their garments" on public.Garment
    for all using ( auth.uid() = userId );
  ```

### 6. Tests (Vitest)
* Install: `npm i -D vitest @testing-library/react`  
* Add `tests/api/garments.test.ts` with MSW mocking Supabase + prisma test db.

### 7. Home Page Wiring
* Replace mock `useState` in `app/page.tsx` with SWR:
  ```ts
  const { data: garments, mutate } = useSWR("/api/garments", fetcher);
  ```
* Update quick-action handlers to `fetch('/api/garments/'+id,{method:'PUT',body:...})` then `mutate()`.

**Done ⇒ UI now reads/writes live data.**

---

## 2️⃣ Tag Management (after CRUD)
1. Extend Prisma `Tag` + many-to-many join or relation field shown above.  
2. Create `TagService`, `app/api/tags` routes (similar pattern).  
3. Hook `TagInput` to POST /api/tags, update SWR cache.

## 3️⃣ Image Upload Pipeline
1. Configure Supabase Storage bucket `garment-images`.  
2. Implement `ImageService.uploadImage(file, garmentId)`.  
3. API: `POST /api/images` → returns public URL.  
4. Use `ImageUpload` → `ImageCropper` → call service, then PATCH garment with `imageUrl`.

## 4️⃣ Auth & Profile Update Flow
1. Install `@next-auth/supabase-adapter`.  
2. Create `[...nextauth]` route & provider config.  
3. `/account/edit` PATCH `/api/user/profile` updating Supabase `auth.users` metadata.

## 5️⃣ Testing & CI
1. Configure `vitest.config.ts` + `jest-dom`.  
2. Add GitHub Action:
   ```yaml
   - uses: actions/setup-node@v3
   - run: npm ci
   - run: npm run lint
   - run: npm run test -- --run
   ```

---

_Keep this guide updated as epics progress._