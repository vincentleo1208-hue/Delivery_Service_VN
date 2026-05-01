import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  LOST = 'lost',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  pickupAddress?: string;

  @Column({ nullable: true })
  quoteSessionId?: string;

  @Column({ type: 'json', nullable: true })
  shipmentDetails?: Record<string, any>;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
