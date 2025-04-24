import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { validationResult } from 'express-validator';

const trainingRepository = AppDataSource.getRepository(Training);

// Get all trainings
export const getTrainings = async (_req: Request, res: Response) => {
  try {
    const trainings = await trainingRepository.find({
      relations: ['attendances', 'attendances.user']
    });
    return res.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get training by ID
export const getTrainingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const training = await trainingRepository.findOne({
      where: { id },
      relations: ['attendances', 'attendances.user']
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    return res.json(training);
  } catch (error) {
    console.error('Error fetching training:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new training
export const createTraining = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, trainer, location, time, date } = req.body;

    const training = trainingRepository.create({
      name,
      trainer,
      location,
      time,
      date
    });

    await trainingRepository.save(training);
    return res.status(201).json(training);
  } catch (error) {
    console.error('Error creating training:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update training
export const updateTraining = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, trainer, location, time, date, title, description, startDate, endDate } = req.body;

    const training = await trainingRepository.findOne({ where: { id } });
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (name) training.name = name;
    if (trainer) training.trainer = trainer;
    if (location) training.location = location;
    if (time) training.time = time;
    if (date) training.date = date;
    if (title) training.title = title;
    if (description !== undefined) training.description = description;
    if (startDate) training.startDate = new Date(startDate);
    if (endDate) training.endDate = new Date(endDate);

    await trainingRepository.save(training);
    return res.json(training);
  } catch (error) {
    console.error('Error updating training:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete training
export const deleteTraining = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const training = await trainingRepository.findOne({ where: { id } });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    await trainingRepository.remove(training);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting training:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 