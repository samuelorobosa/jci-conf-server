import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Delegate } from '../entities/Delegate';
import { Training } from '../entities/Training';
import { validationResult } from 'express-validator';

const delegateRepository = AppDataSource.getRepository(Delegate);
const trainingRepository = AppDataSource.getRepository(Training);

// Get all delegates
export const getDelegates = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      localOrganization = '',
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const queryBuilder = delegateRepository.createQueryBuilder('delegate')
      .leftJoinAndSelect('delegate.trainings', 'training');

    // Add search conditions
    if (search) {
      queryBuilder.where(
        '(delegate.fullName ILIKE :search OR delegate.email ILIKE :search OR delegate.localOrganization ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Add local organization filter
    if (localOrganization) {
      queryBuilder.andWhere('delegate.localOrganization = :localOrganization', { localOrganization });
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Add pagination
    const delegates = await queryBuilder
      .skip(skip)
      .take(limitNumber)
      .getMany();

    res.json({
      data: delegates,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Error fetching delegates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get delegate by ID
export const getDelegateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const delegate = await delegateRepository.findOne({
      where: { id },
      relations: ['trainings']
    });

    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    return res.json(delegate);
  } catch (error) {
    console.error('Error fetching delegate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new delegate
export const createDelegate = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, localOrganization, organizationType, email, phoneNumber } = req.body;

    const delegate = delegateRepository.create({
      fullName,
      localOrganization,
      organizationType,
      email,
      phoneNumber
    });

    await delegateRepository.save(delegate);
    return res.status(201).json(delegate);
  } catch (error) {
    console.error('Error creating delegate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update delegate
export const updateDelegate = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { fullName, localOrganization, organizationType, email, phoneNumber } = req.body;

    const delegate = await delegateRepository.findOne({ where: { id } });
    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    if (fullName) delegate.fullName = fullName;
    if (localOrganization) delegate.localOrganization = localOrganization;
    if (organizationType) delegate.organizationType = organizationType;
    if (email) delegate.email = email;
    if (phoneNumber) delegate.phoneNumber = phoneNumber;

    await delegateRepository.save(delegate);
    return res.json(delegate);
  } catch (error) {
    console.error('Error updating delegate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete delegate
export const deleteDelegate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const delegate = await delegateRepository.findOne({ where: { id } });

    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    await delegateRepository.remove(delegate);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting delegate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign trainings to delegate
export const assignTrainings = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { trainingIds } = req.body;

    const delegate = await delegateRepository.findOne({
      where: { id },
      relations: ['trainings']
    });

    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    const trainings = await trainingRepository.findByIds(trainingIds);
    delegate.trainings = trainings;

    await delegateRepository.save(delegate);
    return res.json(delegate);
  } catch (error) {
    console.error('Error assigning trainings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign banquet seating
export const assignBanquetSeating = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { tableNumber, seatNumber } = req.body;

    const delegate = await delegateRepository.findOne({ where: { id } });
    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    delegate.tableNumber = tableNumber;
    delegate.seatNumber = seatNumber;

    await delegateRepository.save(delegate);
    return res.json(delegate);
  } catch (error) {
    console.error('Error assigning banquet seating:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get delegate details from QR code
export const getDelegateFromQR = async (req: Request, res: Response) => {
  try {
    const { qrCode } = req.params;
    const delegate = await delegateRepository.findOne({
      where: { id: qrCode },
      relations: ['trainings']
    });

    if (!delegate) {
      return res.status(404).json({ message: 'Delegate not found' });
    }

    return res.json(delegate);
  } catch (error) {
    console.error('Error fetching delegate from QR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 