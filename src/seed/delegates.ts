import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { AppDataSource } from '../config/database';
import { Delegate, OrganizationType } from '../entities/Delegate';

/**
 * Seeds delegates from a CSV file into the database.
 */
export const seedDelegates = async (): Promise<void> => {
  const delegateRepository = AppDataSource.getRepository(Delegate);

  // Delete all existing delegates and related training records
  await AppDataSource.query('TRUNCATE TABLE "delegate_trainings" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "delegates" CASCADE');
  console.log('Cleared existing delegate data');

  const filePath: string = path.join(__dirname, '../data/delegates.csv');

  const delegates: Delegate[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: Record<string, string>) => {
        try {
          const firstName: string = row['Name of Delegate (Firstname)']?.trim() || '';
          const surname: string = row['Name of Delegate (Surname)']?.trim() || '';
          const fullName: string = `${firstName} ${surname}`.trim();
          const localOrganization: string = row['Local Organisation']?.trim() || '';
          const email: string = row['Email']?.trim() || '';
          const phoneNumber: string = row['Phone']?.trim() || '';

          const delegate = new Delegate();
          delegate.fullName = fullName;
          delegate.localOrganization = localOrganization;
          delegate.organizationType = OrganizationType.CITY;
          delegate.email = email;
          delegate.phoneNumber = phoneNumber;

          delegates.push(delegate);
        } catch (error) {
          console.error('Error processing row:', row, error);
        }
      })
      .on('end', async () => {
        try {
          await delegateRepository.save(delegates);
          console.log(`${delegates.length} delegates seeded successfully.`);
          resolve();
        } catch (error) {
          console.error('Error saving delegates to the database:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
};
