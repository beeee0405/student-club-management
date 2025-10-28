# Backend API (Express + Prisma)

## Setup

1. Create `.env` in `backend/` based on `.env.example`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/student_club_db?schema=public"
JWT_SECRET="your-strong-secret"
PORT=5000
UPLOAD_DIR="uploads"
```

2. Install deps and generate Prisma Client

```
npm install
npm run prisma:generate
```

3. (Optional) Run migrations if you have a Postgres instance ready

```
npm run prisma:migrate
```

4. Start in dev

```
npm run dev
```

API is served at `http://localhost:5000/api`.

## Endpoints (MVP)

- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me` (Bearer token)
- Users (requires admin)
  - GET `/api/users` (page, limit, search)
  - GET `/api/users/:id`
  - POST `/api/users`
  - PUT `/api/users/:id`
  - DELETE `/api/users/:id`
- Clubs
  - GET `/api/clubs` (page, limit, search)
  - GET `/api/clubs/:id`
  - POST `/api/clubs` (multipart, field: image)
  - PUT `/api/clubs/:id` (multipart)
  - DELETE `/api/clubs/:id`
  - GET `/api/clubs/:clubId/members`
  - POST `/api/clubs/:clubId/members`
  - DELETE `/api/clubs/:clubId/members/:userId`
  - GET `/api/clubs/:clubId/events`
- Events
  - GET `/api/events` (page, limit, search, clubId, startDate, endDate)
  - GET `/api/events/:id`
  - POST `/api/events` (multipart, field: image)
  - PUT `/api/events/:id` (multipart)
  - DELETE `/api/events/:id`
  - GET `/api/events/upcoming`

Notes:
- Static uploads at `/uploads/*`.
- Passwords are hashed with bcryptjs.
