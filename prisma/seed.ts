import { runDatabaseSeed } from '../src/lib/seed-data';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding NOVA database with realistic mock data...');
  const result = await runDatabaseSeed();
  console.log(`✅ Database seeded successfully: ${result.projectsCount} projects, ${result.tasksCount} tasks, ${result.usersCount} users!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
