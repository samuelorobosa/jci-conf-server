import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getTrainingAttendance,
  getUserAttendance,
  checkIn,
  getTrainingStats
} from '../controllers/attendance.controller';
import { authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/User';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get attendance for a training (admin and delegates)
router.get('/training/:trainingId', getTrainingAttendance);

// Get attendance for a user (admin or self)
router.get('/user/:userId', getUserAttendance);

// Check in for a training (delegates only)
router.post(
  '/check-in/:trainingId',
  authorize([UserRole.DELEGATE]),
  checkIn
);

// Get attendance statistics for a training (admin only)
router.get('/stats/:trainingId', authorize([UserRole.ADMIN]), getTrainingStats);

export default router; 