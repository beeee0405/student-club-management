import 'dotenv/config';
import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Administrator';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, password: hashed, role: 'ADMIN' },
    select: { id: true, email: true, name: true, role: true },
  });
  // eslint-disable-next-line no-console
  console.log('Created admin user:', user);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
