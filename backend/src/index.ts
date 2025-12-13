import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import clubRoutes from './routes/clubs';
import eventRoutes from './routes/events';
import { execSync } from 'child_process';
import { prisma } from './prisma/client';

const app = express();

// CORS: allow all origins (frontend domains may vary on Vercel); credentials true to support auth header
const corsOptions: cors.CorsOptions = {
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('CORS configured: allow all origins');

// Apply CORS middleware - must be BEFORE routes
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);

const port = Number(process.env.PORT || 5000);
async function start() {
  try {
    console.log('Running prisma migrate deploy...');
    try {
      execSync('npx prisma migrate deploy --schema src/prisma/schema.prisma', { stdio: 'inherit' });
      console.log('Migrations deployed');
    } catch (err) {
      console.warn('migrate deploy failed, attempting prisma db push', err);
      execSync('npx prisma db push --schema src/prisma/schema.prisma', { stdio: 'inherit' });
      console.log('prisma db push completed');
    }

    // quick test connection
    await prisma.$queryRaw`SELECT 1`;

    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB/migration error:', err);
    process.exit(1);
  }
}

start();
