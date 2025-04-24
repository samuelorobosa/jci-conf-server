import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Attendance } from '../entities/Attendance';
import { Training } from '../entities/Training';
import { User } from '../entities/User';
import { validationResult } from 'express-validator';

const attendanceRepository = AppDataSource.getRepository(Attendance);
const trainingRepository = AppDataSource.getRepository(Training);
const userRepository = AppDataSource.getRepository(User);

// Get attendance for a training
export const getTrainingAttendance = async (req: Request, res: Response) => {
  try {
    const { trainingId } = req.params;
    const attendances = await attendanceRepository.find({
      where: { trainingId },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    });
    res.json(attendances);
  } catch (error) {
    console.error('Error fetching training attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance for a user
export const getUserAttendance = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const attendances = await attendanceRepository.find({
      where: { userId },
      relations: ['training'],
      select: {
        training: {
          id: true,
          name: true,
          date: true,
          time: true,
          location: true
        }
      }
    });
    res.json(attendances);
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check in for a training
export const checkIn = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trainingId } = req.params;
    const userId = req.user!.userId;

    // Check if training exists
    const training = await trainingRepository.findOne({ where: { id: trainingId } });
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    // Check if user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already checked in
    const existingAttendance = await attendanceRepository.findOne({
      where: { trainingId, userId }
    });

    if (existingAttendance) {
      if (existingAttendance.checkedIn) {
        return res.status(400).json({ message: 'Already checked in' });
      }
      existingAttendance.checkedIn = true;
      existingAttendance.checkInAt = new Date();
      await attendanceRepository.save(existingAttendance);
      return res.json(existingAttendance);
    }

    // Create new attendance record
    const attendance = attendanceRepository.create({
      trainingId,
      userId,
      checkedIn: true,
      checkInAt: new Date()
    });

    await attendanceRepository.save(attendance);
    return res.status(201).json(attendance);
  } catch (error) {
    console.error('Error checking in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance statistics for a training
export const getTrainingStats = async (req: Request, res: Response) => {
  try {
    const { trainingId } = req.params;
    const totalAttendees = await attendanceRepository.count({
      where: { trainingId }
    });
    const checkedInAttendees = await attendanceRepository.count({
      where: { trainingId, checkedIn: true }
    });

    res.json({
      totalAttendees,
      checkedInAttendees,
      checkInRate: totalAttendees > 0 ? (checkedInAttendees / totalAttendees) * 100 : 0
    });
  } catch (error) {
    console.error('Error fetching training stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 