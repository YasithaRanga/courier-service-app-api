import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [{ name: 'USER' }, { name: 'ADMIN' }],
    skipDuplicates: true,
  });

  const hashedPassword = await bcrypt.hash('admin', 12);
  const userRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  return await prisma.user.create({
    data: {
      name: 'ADMIN',
      email: 'admin@admin.com',
      password: hashedPassword,
      address: '',
      roleId: userRole?.id ?? 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
