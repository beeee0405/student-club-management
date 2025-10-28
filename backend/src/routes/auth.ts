import { Router } from 'express';
import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function signToken(payload: { id: number; role: 'ADMIN' | 'USER' }) {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = signToken({ id: user.id, role: user.role });
    return res.json({ user, token });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const result = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = signToken({ id: user.id, role: user.role });
    return res.json({ user: result, token });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ message: err.errors?.[0]?.message || 'Invalid input' });
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
