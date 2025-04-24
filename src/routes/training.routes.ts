import { Router } from 'express';
import { body } from 'express-validator';
import { getTrainings, getTrainingById, createTraining, updateTraining, deleteTraining } from '../controllers/training.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/User';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all trainings (admin and delegates)
router.get('/', getTrainings);

// Get training by ID (admin and delegates)
router.get('/:id', getTrainingById);

// Create new training (admin and super admin only)
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('trainer').notEmpty().withMessage('Trainer is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('date').isDate().withMessage('Invalid date format')
  ],
  createTraining
);

// Update training (admin and super admin only)
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('trainer').optional().notEmpty().withMessage('Trainer cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('time').optional().notEmpty().withMessage('Time cannot be empty'),
    body('date').optional().isDate().withMessage('Invalid date format')
  ],
  updateTraining
);

// Delete training (admin and super admin only)
router.delete('/:id', authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), deleteTraining);

export default router; 