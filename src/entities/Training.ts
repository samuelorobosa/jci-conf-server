import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attendance } from './Attendance';

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @Column()
  trainer!: string;

  @Column()
  location!: string;

  @Column()
  time!: string;

  @Column()
  date!: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Attendance, attendance => attendance.training)
  attendances!: Attendance[];
} 