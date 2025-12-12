# Deploy to Supabase + Vercel (quick guide)

This file documents the quick steps to deploy the backend as serverless functions on Vercel and use Supabase as the Postgres DB.

1) Create Supabase project
   - https://app.supabase.com → New project → name `clbtdmu` → choose region
   - Save Database password you create

2) Get connection & keys
   - Settings → Database → Connect → copy Connection string (URI) -> this is your DATABASE_URL
   - Settings → API → copy Project URL (SUPABASE_URL) and Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

3) Apply Prisma schema to Supabase
   - On your machine, in `backend/`:
     ```powershell
     cd backend
     $env:DATABASE_URL = 'postgres://...'
     npm ci
     npx prisma generate
     npx prisma db push --schema src/prisma/schema.prisma --accept-data-loss
     npm run build
     node build/scripts/seed.js
     ```

4) Configure Vercel
   - Import GitHub repo `beeee0405/student-club-management`, set Root = `frontend`
   - Add Environment Variables in Project Settings:
     - SUPABASE_URL = https://xxxxx.supabase.co
     - SUPABASE_SERVICE_ROLE_KEY = <service role key>
     - VITE_API_URL = https://<your-vercel-app>.vercel.app/api

5) Test endpoints
   - https://<your-vercel-app>.vercel.app/api/health
   - https://<your-vercel-app>.vercel.app/api/clubs

Security: keep Service Role Key secret. Do not commit secrets to git.
