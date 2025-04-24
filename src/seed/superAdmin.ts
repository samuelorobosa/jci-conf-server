import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import * as bcrypt from 'bcryptjs';

export const seedSuperAdmin = async () => {
  const userRepository = AppDataSource.getRepository(User);

  // Check if super admin already exists
  const existingSuperAdmin = await userRepository.findOne({
    where: { role: UserRole.SUPER_ADMIN }
  });

  if (existingSuperAdmin) {
    console.log('Super admin already exists');
    return;
  }

  // Create super admin
  const superAdmin = new User();
  superAdmin.email = 'superadmin@example.com';
  superAdmin.name = 'Super Admin';
  superAdmin.role = UserRole.SUPER_ADMIN;
  superAdmin.password = await bcrypt.hash('superadmin123', 10);

  try {
    await userRepository.save(superAdmin);
    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
}; 