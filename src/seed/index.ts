import { AppDataSource } from '../config/database';
// import { seedSuperAdmin } from './superAdmin';
import { seedDelegates } from './delegates';

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    // Seed super admin
    // await seedSuperAdmin();

    // Seed delegates
    await seedDelegates();

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed(); 