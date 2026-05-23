const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  // Create a trainer with a couple of dogs
  const trainer = await prisma.trainer.create({
    data: {
      email: 'trainer@example.com',
      name: 'Demo Trainer',
      dogs: {
        create: [
          {
            name: 'Bella',
            age: '3',
            breed: 'Labrador Retriever',
            status: 'active',
            owner: 'Anna Hansen',
          },
          {
            name: 'Milo',
            age: '2',
            breed: 'Border Collie',
            status: 'active',
            owner: 'Jonas Berg',
          },
        ],
      },
    },
  });

  console.log('Created trainer:', trainer.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
