import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { CarrierPricing, PricingTier } from '../entities/carrier-pricing.entity';
import {
  CreateCarrierPricingDto,
  UpdateCarrierPricingDto,
  BulkUploadPricingDto,
  PricingFilterDto,
} from '../dto/pricing.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(CarrierPricing)
    private readonly pricingRepository: Repository<CarrierPricing>,
  ) {}

  async create(
    createPricingDto: CreateCarrierPricingDto,
    user?: User,
  ): Promise<CarrierPricing> {
    // Check for duplicate
    const existing = await this.pricingRepository.findOne({
      where: {
        carrier: createPricingDto.carrier,
        serviceCode: createPricingDto.serviceCode,
        zone: createPricingDto.zone || 'domestic',
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Pricing already exists for ${createPricingDto.carrier} - ${createPricingDto.serviceCode} in zone ${createPricingDto.zone || 'domestic'}`,
      );
    }

    const pricing = this.pricingRepository.create({
      ...createPricingDto,
      createdBy: user || null,
    });

    return await this.pricingRepository.save(pricing);
  }

  async findAll(filters: PricingFilterDto): Promise<{ data: CarrierPricing[]; total: number; page: number; limit: number }> {
    const { carrier, serviceCode, zone, pricingTier, isActive, search, page = 1, limit = 20 } = filters;

    const where: any = {};

    if (carrier) {
      where.carrier = Like(`%${carrier}%`);
    }

    if (serviceCode) {
      where.serviceCode = Like(`%${serviceCode}%`);
    }

    if (zone) {
      where.zone = zone;
    }

    if (pricingTier) {
      where.pricingTier = pricingTier;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.carrier = ILike(`%${search}%`);
    }

    const [data, total] = await this.pricingRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CarrierPricing> {
    const pricing = await this.pricingRepository.findOne({ where: { id } });

    if (!pricing) {
      throw new NotFoundException(`Pricing record with ID ${id} not found`);
    }

    return pricing;
  }

  async update(
    id: string,
    updatePricingDto: UpdateCarrierPricingDto,
    user?: User,
  ): Promise<CarrierPricing> {
    const pricing = await this.findOne(id);

    Object.assign(pricing, updatePricingDto);

    return await this.pricingRepository.save(pricing);
  }

  async remove(id: string): Promise<void> {
    const pricing = await this.findOne(id);
    await this.pricingRepository.remove(pricing);
  }

  async bulkUpload(
    bulkUploadDto: BulkUploadPricingDto,
    user?: User,
  ): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (let i = 0; i < bulkUploadDto.pricingRecords.length; i++) {
      const record = bulkUploadDto.pricingRecords[i];
      try {
        await this.create(record, user);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          index: i,
          record,
          error: error.message,
        });
      }
    }

    return results;
  }

  async findByCarrierAndService(
    carrier: string,
    serviceCode: string,
    zone?: string,
  ): Promise<CarrierPricing | null> {
    return await this.pricingRepository.findOne({
      where: {
        carrier,
        serviceCode,
        zone: zone || 'domestic',
        isActive: true,
      },
    });
  }

  async getActivePricingByCarrier(carrier: string): Promise<CarrierPricing[]> {
    return await this.pricingRepository.find({
      where: { carrier, isActive: true },
      order: { baseRate: 'ASC' },
    });
  }

  async toggleStatus(id: string): Promise<CarrierPricing> {
    const pricing = await this.findOne(id);
    pricing.isActive = !pricing.isActive;
    return await this.pricingRepository.save(pricing);
  }

  async exportToCSV(): Promise<string> {
    const pricing = await this.pricingRepository.find({
      order: { carrier: 'ASC', serviceCode: 'ASC' },
    });

    const headers = [
      'ID',
      'Carrier',
      'Service Code',
      'Zone',
      'Base Rate',
      'Fuel Surcharge %',
      'Residential Surcharge',
      'Signature Fee',
      'Saturday Fee',
      'Oversize Fee',
      'Min Weight (lbs)',
      'Max Weight (lbs)',
      'Pricing Tier',
      'Active',
      'Notes',
      'Created At',
    ];

    const rows = pricing.map((p) => [
      p.id,
      p.carrier,
      p.serviceCode,
      p.zone,
      p.baseRate,
      p.fuelSurchargePercent,
      p.residentialSurcharge,
      p.signatureRequiredFee,
      p.saturdayDeliveryFee,
      p.oversizeFee,
      p.minWeightLbs || '',
      p.maxWeightLbs || '',
      p.pricingTier,
      p.isActive ? 'Yes' : 'No',
      p.notes || '',
      p.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return csvContent;
  }
}
