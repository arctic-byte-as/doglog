const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const keyLength = 64;
const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.scryptSync(password, salt, keyLength, scryptOptions).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  const password = process.env.DOGLOG_PASSWORD || '';

  if (!email || !password) {
    console.error('Usage: DOGLOG_PASSWORD="new password" node scripts/set-user-password.js user@example.com');
    process.exit(1);
  }

  if (password.length < 10) {
    console.error('Password must be at least 10 characters.');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No Doglog user found for ${email}.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(password) },
  });

  await prisma.session.deleteMany({ where: { userId: user.id } });

  console.log(`Password set for ${email}. Existing Doglog sessions cleared.`);
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
