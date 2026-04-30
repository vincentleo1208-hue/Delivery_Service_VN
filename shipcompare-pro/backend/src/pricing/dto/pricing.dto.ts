import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingTier, ZoneType } from '../entities/carrier-pricing.entity';

export class CreateCarrierPricingDto {
  @IsString()
  carrier: string;

  @IsString()
  serviceCode: string;

  @IsEnum(ZoneType)
  @IsOptional()
  zone?: ZoneType;

  @IsNumber()
  @Min(0)
  baseRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fuelSurchargePercent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  residentialSurcharge?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  signatureRequiredFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  saturdayDeliveryFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  oversizeFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minWeightLbs?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxWeightLbs?: number;

  @IsEnum(PricingTier)
  @IsOptional()
  pricingTier?: PricingTier;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  dimensionalFactors?: Record<string, number>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCarrierPricingDto {
  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsEnum(ZoneType)
  @IsOptional()
  zone?: ZoneType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  baseRate?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fuelSurchargePercent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  residentialSurcharge?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  signatureRequiredFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  saturdayDeliveryFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  oversizeFee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minWeightLbs?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxWeightLbs?: number;

  @IsEnum(PricingTier)
  @IsOptional()
  pricingTier?: PricingTier;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  dimensionalFactors?: Record<string, number>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkUploadPricingDto {
  @ValidateNested({ each: true })
  @Type(() => CreateCarrierPricingDto)
  pricingRecords: CreateCarrierPricingDto[];
}

export class PricingFilterDto {
  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsEnum(ZoneType)
  @IsOptional()
  zone?: ZoneType;

  @IsEnum(PricingTier)
  @IsOptional()
  pricingTier?: PricingTier;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
