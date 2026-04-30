import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum PricingTier {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  CONTRACT = 'contract',
}

export enum ZoneType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
  REGIONAL = 'regional',
}

@Entity('carrier_pricing')
@Unique(['carrier', 'serviceCode', 'zone'])
export class CarrierPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  carrier: string; // 'fedex', 'ups', 'dhl', 'usps', etc.

  @Column({ type: 'varchar', length: 100 })
  serviceCode: string; // 'ground', 'overnight', '2day', etc.

  @Column({ type: 'varchar', length: 50, default: ZoneType.DOMESTIC })
  zone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fuelSurchargePercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  residentialSurcharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  signatureRequiredFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saturdayDeliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  oversizeFee: number;

  @Column({ type: 'int', nullable: true })
  minWeightLbs: number | null;

  @Column({ type: 'int', nullable: true })
  maxWeightLbs: number | null;

  @Column({ type: 'varchar', length: 50, default: PricingTier.STANDARD })
  pricingTier: PricingTier;

  @Column({ type: 'jsonb', nullable: true })
  dimensionalFactors: Record<string, number> | null; // { divisor: 139, factor: 0.25 }

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  createdBy: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
