import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Training } from './Training';

export enum OrganizationType {
  CITY = 'CITY',
  STATE = 'STATE',
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL'
}

@Entity('delegates')
export class Delegate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  localOrganization!: string;

  @Column({
    type: 'enum',
    enum: OrganizationType,
    default: OrganizationType.CITY
  })
  organizationType: OrganizationType = OrganizationType.CITY;

  @Column()
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column({ type: 'integer', nullable: true })
  tableNumber!: number;

  @Column({ type: 'integer', nullable: true })
  seatNumber!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany(() => Training)
  @JoinTable({
    name: 'delegate_trainings',
    joinColumn: { name: 'delegateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainingId', referencedColumnName: 'id' }
  })
  trainings!: Training[];
} 