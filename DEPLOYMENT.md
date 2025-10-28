# Student Club Management - Deployment Guide

## 🚀 Deploy to Production

### Prerequisites
1. GitHub account
2. Vercel account (for frontend)
3. Render account (for backend + database)

---

## Backend Deployment (Render)

### 1. Create PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **PostgreSQL**
3. Name: `clbtdmu-db`
4. Plan: Free
5. Copy the **Internal Database URL** (starts with `postgresql://`)

### 2. Deploy Backend Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Environment Variables**:
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   PORT=5000
   UPLOAD_DIR=uploads
   JWT_SECRET=<generate-random-string-here>
   NODE_ENV=production
   ```

5. Click **Create Web Service**
6. After deployment, copy the service URL (e.g., `https://your-backend.onrender.com`)

### 3. Run Database Migration
In Render dashboard → your service → **Shell** tab:
```bash
npx prisma migrate deploy
npx ts-node src/scripts/seed.ts  # Optional: seed initial data
```

---

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

6. Click **Deploy**

### 2. Add Custom Domain
1. In Vercel project → **Settings** → **Domains**
2. Add `clbtdmu.id.vn`
3. Follow DNS instructions:
   - Add **CNAME** record: `clbtdmu.id.vn` → `cname.vercel-dns.com`
   - Add **CNAME** for API: `api.clbtdmu.id.vn` → `your-backend.onrender.com`

---

## 🔧 Local Development Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with local SQLite: DATABASE_URL="file:./dev.db"
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

---

## 📝 Important Notes

### File Uploads
- **Render free tier**: File uploads are ephemeral (lost on restart)
- **Solution**: Use Cloudinary/AWS S3 for production images
- For testing: Uploads work but may be cleared periodically

### Database Backups
- Render PostgreSQL free tier: 90-day retention
- Export backups regularly via Render dashboard

### Cold Starts
- Free tier services sleep after 15 mins of inactivity
- First request after sleep takes ~30-60 seconds

### Environment Variables
- Never commit `.env` files to Git
- Use `.env.example` as template
- Set production secrets in hosting platform dashboard

---

## 🐛 Troubleshooting

### Backend won't start
1. Check Render logs for errors
2. Verify `DATABASE_URL` is set correctly
3. Ensure migrations ran successfully: `npx prisma migrate deploy`

### Frontend can't connect to API
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify CORS is enabled in backend
3. Test API directly: `https://your-backend.onrender.com/api/health`

### Images not loading
1. Check `UPLOAD_DIR` env var
2. Verify uploads folder exists
3. For production: migrate to Cloudinary (see migration guide)

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS for all API calls (automatic with Vercel/Render)
- [ ] Don't commit `.env` or database files
- [ ] Set `NODE_ENV=production` in Render

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
