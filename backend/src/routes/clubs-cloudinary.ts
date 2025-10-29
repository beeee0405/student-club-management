import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import cloudinary from '../lib/cloudinary';
import { Readable } from 'stream';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

const ClubSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  facebookUrl: z
    .string()
    .url('Đường dẫn Facebook không hợp lệ')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

// Helper to upload buffer to Cloudinary
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

router.get('/', async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const search = (req.query.search as string) || '';
  const skip = (page - 1) * limit;

  const where = search ? { name: { contains: search } } : {};

  const [clubs, total] = await Promise.all([
    prisma.club.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: { select: { events: true, members: true } },
      },
    }),
    prisma.club.count({ where }),
  ]);

  const mapped = clubs.map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image,
    facebookUrl: c.facebookUrl,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    eventCount: c._count?.events ?? 0,
    memberCount: c._count?.members ?? 0,
  }));

  res.json({ clubs: mapped, total });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club) return res.status(404).json({ message: 'Club not found' });
  res.json(club);
});

router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = ClubSchema.parse(req.body);
    let image: string | undefined;
    
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'clubs');
    }
    
    const club = await prisma.club.create({ data: { ...data, image } });
    res.status(201).json(club);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    const data = ClubSchema.partial().parse(req.body);
    let image: string | undefined;
    
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'clubs');
    }
    
    const updateData = image ? { ...data, image } : data;

    const club = await prisma.club.update({ where: { id }, data: updateData });
    res.json(club);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    if (err.code === 'P2025') return res.status(404).json({ message: 'Club not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.club.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Club not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Members subroutes
router.get('/:clubId/members', requireAuth, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const members = await prisma.member.findMany({
    where: { clubId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  res.json(members.map((m: any) => ({
    id: m.id,
    clubId: m.clubId,
    userId: m.userId,
    role: m.role,
    user: m.user,
    joinedAt: m.joinedAt,
  })));
});

router.post('/:clubId/members', requireAuth, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const bodySchema = z.object({ userId: z.number(), role: z.string().optional() });
  try {
    const { userId, role } = bodySchema.parse(req.body);
    const member = await prisma.member.create({ data: { clubId, userId, role: role || 'member' } });
    res.status(201).json(member);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:clubId/members/:userId', requireAuth, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const userId = Number(req.params.userId);
  try {
    await prisma.member.deleteMany({ where: { clubId, userId } });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
