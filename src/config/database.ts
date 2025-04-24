import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Attendance } from '../entities/Attendance';
import { Delegate } from '../entities/Delegate';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Training, Attendance, Delegate],
  subscribers: [],
}); 