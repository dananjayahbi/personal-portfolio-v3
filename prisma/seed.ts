import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@studio.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeMe123!";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Portfolio Admin";
const ADMIN_AVATAR = process.env.ADMIN_AVATAR ?? null;
const ADMIN_BIO = process.env.ADMIN_BIO ?? null;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      passwordHash,
      avatarUrl: ADMIN_AVATAR,
      bio: ADMIN_BIO,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      avatarUrl: ADMIN_AVATAR,
      bio: ADMIN_BIO,
    },
  });

  console.info(`✅ Admin ready at ${ADMIN_EMAIL}.`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to seed database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
