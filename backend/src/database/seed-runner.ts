import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { seedDatabase } from './seed';

async function runSeed() {
  const dataSource = new DataSource(databaseConfig as any);
  
  try {
    await dataSource.initialize();
    console.log('Database connection established');
    
    await seedDatabase(dataSource);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();