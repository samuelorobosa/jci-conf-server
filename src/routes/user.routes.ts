import { Router } from 'express';
import { body } from 'express-validator';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/User';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all users (admin only)
router.get('/', authorize([UserRole.ADMIN]), getUsers);

// Get user by ID (admin or self)
router.get('/:id', authorize([UserRole.ADMIN]), getUserById);

// Create new user (admin only)
router.post(
  '/',
  authorize([UserRole.ADMIN]),
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['ADMIN', 'DELEGATE']).withMessage('Invalid role')
  ],
  createUser
);

// Update user (admin or self)
router.put(
  '/:id',
  authorize([UserRole.ADMIN]),
  [
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(['ADMIN', 'DELEGATE']).withMessage('Invalid role')
  ],
  updateUser
);

// Delete user (admin only)
router.delete('/:id', authorize([UserRole.ADMIN]), deleteUser);

export default router; 