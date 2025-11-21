import { userFacade } from '../facade/userFacade';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    const users = [
      { name: 'Alice Johnson' },
      { name: 'Bob Smith' },
      { name: 'Charlie Davis' },
      { name: 'Diana Prince' },
      { name: 'Ethan Hunt' },
    ];

    console.log('Creating users...');
    for (const userData of users) {
      const user = await userFacade.createUser(userData);
      console.log(`✓ Created user: ${user.name} (ID: ${user.id})`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now run the app and visit /users to see the data.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

