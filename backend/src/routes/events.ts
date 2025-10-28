import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `event_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({ storage });
const router = Router();

const EventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  clubId: z.preprocess((v) => Number(v), z.number().int()),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().optional(),
});

router.get('/', async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const search = (req.query.search as string) || '';
  const clubId = req.query.clubId ? Number(req.query.clubId) : undefined;
  const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
  const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;

  const skip = (page - 1) * limit;

  const where: any = {};
  // SQLite doesn't support mode: 'insensitive'; use simple contains for compatibility
  if (search) where.title = { contains: search };
  if (clubId) where.clubId = clubId;
  if (startDate || endDate) where.startDate = { gte: startDate };
  if (endDate) where.endDate = { lte: endDate };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' },
      skip,
      take: limit,
      include: { club: { select: { name: true } } },
    }),
    prisma.event.count({ where }),
  ]);

  // Map to include clubName and remove nested 'club' to keep response shape flat
  const mapped = events.map((e: any) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    clubId: e.clubId,
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location,
    image: e.image,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
    clubName: e.club?.name || '',
  }));

  res.json({ events: mapped, total });
});

router.get('/upcoming', async (req, res) => {
  const limit = parseInt((req.query.limit as string) || '5', 10);
  const events = await prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = EventSchema.parse(req.body);
    const image = req.file ? `/${uploadDir}/${req.file.filename}` : undefined;
    const event = await prisma.event.create({ 
      data: { 
        ...data, 
        image,
        clubId: Number(data.clubId)
      } 
    });
    res.status(201).json(event);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    const data = EventSchema.partial().parse(req.body);
    const image = req.file ? `/${uploadDir}/${req.file.filename}` : undefined;
    const updateData = image ? { ...data, image } : data;

    const event = await prisma.event.update({ where: { id }, data: updateData });
    res.json(event);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    if (err.code === 'P2025') return res.status(404).json({ message: 'Event not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Event not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Club events
router.get('/club/:clubId', requireAuth, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const events = await prisma.event.findMany({ where: { clubId }, orderBy: { startDate: 'desc' } });
  res.json(events);
});

export default router;
