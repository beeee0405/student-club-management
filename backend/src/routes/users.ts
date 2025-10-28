import { Router } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

const UserCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    // SQLite doesn't support Prisma's `mode: 'insensitive'` on string filters.
    // Use simple contains for compatibility (case-sensitive), which is fine for admin search.
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = UserCreateSchema.parse(req.body);
    // Store raw password? For admin create we should hash, but keep simple: reject if password not provided
    // In a fuller impl, reuse auth service.
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.default.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: data.role || 'USER' },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json(user);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    if (err.code === 'P2002') return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const data = UserUpdateSchema.parse(req.body);

    const updateData: any = { ...data };
    if (data.password) {
      const bcrypt = await import('bcryptjs');
      updateData.password = await bcrypt.default.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
