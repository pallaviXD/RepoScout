import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding badges...');

  const badges = [
    {
      name: 'First Fork',
      description: 'Forked your first repository',
      icon: '🍴',
      category: 'CONTRIBUTION',
      requirement: 1,
      points: 10
    },
    {
      name: 'Fork Master',
      description: 'Forked 10 repositories',
      icon: '🔱',
      category: 'MILESTONE',
      requirement: 10,
      points: 50
    },
    {
      name: 'Early Bird',
      description: 'Started your open source journey',
      icon: '🌅',
      category: 'CONTRIBUTION',
      requirement: 1,
      points: 5
    },
    {
      name: 'Consistent Contributor',
      description: '7 day contribution streak',
      icon: '🔥',
      category: 'STREAK',
      requirement: 7,
      points: 50
    },
    {
      name: 'Dedication',
      description: '30 day contribution streak',
      icon: '💪',
      category: 'STREAK',
      requirement: 30,
      points: 200
    },
    {
      name: 'Contributor',
      description: 'Made 25 contributions',
      icon: '⭐',
      category: 'MILESTONE',
      requirement: 25,
      points: 100
    },
    {
      name: 'Active Contributor',
      description: 'Made 50 contributions',
      icon: '🌟',
      category: 'MILESTONE',
      requirement: 50,
      points: 250
    },
    {
      name: 'Super Contributor',
      description: 'Made 100 contributions',
      icon: '💫',
      category: 'MILESTONE',
      requirement: 100,
      points: 500
    },
    {
      name: 'Issue Hunter',
      description: 'Closed 10 issues',
      icon: '🎯',
      category: 'SKILL',
      requirement: 10,
      points: 75
    },
    {
      name: 'PR Champion',
      description: 'Merged 10 pull requests',
      icon: '🏆',
      category: 'SKILL',
      requirement: 10,
      points: 100
    }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge
    });
  }

  console.log('✓ Badges seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding badges:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
