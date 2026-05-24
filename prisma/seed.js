const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const trainer = await prisma.trainer.upsert({
    where: { email: 'trainer@example.com' },
    update: { name: 'Demo Trainer' },
    create: {
      email: 'trainer@example.com',
      name: 'Demo Trainer',
    },
  });

  const demoDogs = [
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
  ];

  for (const dog of demoDogs) {
    const existing = await prisma.dog.findFirst({
      where: {
        name: dog.name,
        trainerId: trainer.id,
      },
    });

    if (!existing) {
      await prisma.dog.create({
        data: {
          ...dog,
          trainerId: trainer.id,
        },
      });
    }
  }

  const demoCustomers = [
    {
      email: 'anna.customer@example.com',
      name: 'Anna Hansen',
      phone: '+47 400 10 100',
      notes: 'First-time customer interested in calm greeting routines.',
      dog: {
        name: 'Frida',
        age: '4',
        breed: 'Norwegian Elkhound',
        status: 'Customer active',
      },
      consultation: {
        focus: 'Visitor excitement',
        outcome: 'Build a predictable settle routine before the doorbell.',
        activation: 'Sniff walk - Slow walk where sniffing and choice lead the route',
        stimulusAnalysis: 'Audio - Sounds such as traffic, doorbells, voices, dogs, or machinery\nDoorbell and hallway footsteps are the strongest predictors.',
        prescribedPlan: 'Practise mat settle twice daily. Pair doorbell recordings with food scatter at low volume. Add real doorway practice once recovery is under 30 seconds.',
      },
    },
    {
      email: 'lars.customer@example.com',
      name: 'Lars Nilsen',
      phone: '+47 400 20 200',
      notes: 'Needs support with loose-leash walking near other dogs.',
      dog: {
        name: 'Saga',
        age: '2',
        breed: 'Border Collie',
        status: 'Customer active',
      },
      consultation: {
        focus: 'Leash reactivity',
        outcome: 'Increase distance and reward voluntary check-ins.',
        activation: 'Mental training - Short cue, shaping, or problem-solving sessions',
        stimulusAnalysis: 'Visual - People, dogs, vehicles, movement, posture, or objects\nFast-moving dogs and tense frontal approaches increase arousal.',
        prescribedPlan: 'Start at 25 metres from calm dogs. Reward check-ins and curved movement. Reduce distance only when Saga can disengage twice in a row.',
      },
    },
  ];

  for (const item of demoCustomers) {
    const customer = await prisma.customer.upsert({
      where: { email: item.email },
      update: {
        name: item.name,
        phone: item.phone,
        notes: item.notes,
      },
      create: {
        email: item.email,
        name: item.name,
        phone: item.phone,
        notes: item.notes,
      },
    });

    const dog =
      (await prisma.dog.findFirst({
        where: {
          name: item.dog.name,
          customerId: customer.id,
        },
      })) ||
      (await prisma.dog.create({
        data: {
          ...item.dog,
          owner: customer.name,
          trainerId: trainer.id,
          customerId: customer.id,
        },
      }));

    const existingConsultation = await prisma.consultation.findFirst({
      where: {
        dogId: dog.id,
        focus: item.consultation.focus,
      },
    });

    if (!existingConsultation) {
      await prisma.consultation.create({
        data: {
          date: new Date(),
          dogId: dog.id,
          dogBreed: dog.breed,
          situation: 'Customer demo consultation',
          health: 'No known acute concerns',
          nutrition: 'To be reviewed with customer',
          hormoneAnalysis: 'Not assessed',
          learningHistory: 'Initial customer intake',
          generalDescription: item.consultation.focus,
          ...item.consultation,
        },
      });
    }
  }

  console.log('Demo data ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
