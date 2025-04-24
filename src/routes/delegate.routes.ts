import { Router } from 'express';
import { body } from 'express-validator';
import {
  getDelegates,
  getDelegateById,
  createDelegate,
  updateDelegate,
  deleteDelegate,
  assignTrainings,
  assignBanquetSeating,
  getDelegateFromQR
} from '../controllers/delegate.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/User';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all delegates (admin and delegates)
router.get('/', getDelegates);

// Get delegate by ID (admin and delegates)
router.get('/:id', getDelegateById);

// Get delegate from QR code (admin and super admin only)
router.get('/qr/:delegateId', authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), getDelegateFromQR);

// Create new delegate (admin and super admin only)
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('localOrganization').notEmpty().withMessage('Local organization is required'),
    body('organizationType').isIn(['CITY', 'STATE', 'NATIONAL', 'INTERNATIONAL']).withMessage('Invalid organization type'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required')
  ],
  createDelegate
);

// Update delegate (admin and super admin only)
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('localOrganization').optional().notEmpty().withMessage('Local organization cannot be empty'),
    body('organizationType').optional().isIn(['CITY', 'STATE', 'NATIONAL', 'INTERNATIONAL']).withMessage('Invalid organization type'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phoneNumber').optional().notEmpty().withMessage('Phone number cannot be empty')
  ],
  updateDelegate
);

// Delete delegate (admin and super admin only)
router.delete('/:id', authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), deleteDelegate);

// Assign trainings to delegate (admin and super admin only)
router.post(
  '/:id/trainings',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('trainingIds').isArray().withMessage('Training IDs must be an array'),
    body('trainingIds.*').isUUID().withMessage('Invalid training ID')
  ],
  assignTrainings
);

// Assign banquet seating (admin and super admin only)
router.post(
  '/:id/banquet-seating',
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  [
    body('tableNumber').isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
    body('seatNumber').isInt({ min: 1 }).withMessage('Seat number must be a positive integer')
  ],
  assignBanquetSeating
);

export default router; 