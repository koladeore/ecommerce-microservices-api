import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'ore@gmail.com' },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('0re12345', 10);
    await prisma.user.create({
      data: {
        email: 'ore@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin Ore',
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error('Error disconnecting Prisma:', e);
    });
  });
