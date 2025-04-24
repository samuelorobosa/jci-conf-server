import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = AppDataSource.getRepository(User);

    // Check if super admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@jci.com' }
    });

    if (existingAdmin) {
      console.log('Super admin already exists');
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = userRepository.create({
      email: 'admin@jci.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.ADMIN
    });

    await userRepository.save(superAdmin);
    console.log('Super admin created successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await AppDataSource.destroy();
  }
}

// Run the seed function
seed(); 