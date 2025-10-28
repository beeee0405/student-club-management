import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import clubRoutes from './routes/clubs';
import eventRoutes from './routes/events';

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${uploadDir}`, express.static(path.resolve(uploadDir)));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});
