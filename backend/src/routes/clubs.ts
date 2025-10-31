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
    .optional()
    .nullable()
    .transform(val => {
      if (!val || val === '') return undefined;
      return val;
    }),
  type: z.enum(['STUDENT', 'FACULTY']),
  faculty: z.string().optional().nullable().transform(val => {
    if (!val || val === '') return undefined;
    return val;
  }),
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
  const type = req.query.type as string; // 'STUDENT' or 'FACULTY'
  const skip = (page - 1) * limit;

  const where: any = search ? { name: { contains: search } } : {};
  if (type) {
    where.type = type;
  }

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
    type: c.type,
    faculty: c.faculty,
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
    // Log received data for debugging
    console.log('Received update request for club', id);
    console.log('Request body:', req.body);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('File:', req.file ? 'Yes' : 'No');
    
    // For update, make all fields optional
    const UpdateSchema = ClubSchema.partial();
    
    // Validate
    const parseResult = UpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      console.error('Zod validation failed:', JSON.stringify(parseResult.error.issues, null, 2));
      const errorMessage = parseResult.error.issues?.[0]?.message || 'Invalid input';
      return res.status(400).json({ 
        message: errorMessage, 
        errors: parseResult.error.issues,
        receivedData: req.body 
      });
    }
    
    const data = parseResult.data;
    
    let image: string | undefined;
    
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'clubs');
    }
    
    const updateData = image ? { ...data, image } : data;
    
    console.log('Parsed data to update:', updateData);

    const club = await prisma.club.update({ where: { id }, data: updateData });
    res.json(club);
  } catch (err: any) {
    console.error('Update club error:', err);
    if (err.name === 'ZodError') {
      console.error('Zod validation errors:', JSON.stringify(err.errors, null, 2));
      const errorMessage = err.errors?.[0]?.message || 'Invalid input';
      return res.status(400).json({ message: errorMessage, errors: err.errors });
    }
    if (err.code === 'P2025') return res.status(404).json({ message: 'Club not found' });
    res.status(500).json({ message: 'Server error', error: err.message });
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
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Events under a club (matches frontend GET /clubs/:clubId/events)
router.get('/:clubId/events', requireAuth, async (req, res) => {
  const clubId = Number(req.params.clubId);
  const events = await prisma.event.findMany({ where: { clubId }, orderBy: { startDate: 'desc' } });
  res.json(events);
});

export default router;
