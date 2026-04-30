import { IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SurchargeDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;
}

export class QuoteResult {
  @IsString()
  id: string;

  @IsString()
  carrierId: string;

  @IsString()
  carrierName: string;

  @IsString()
  serviceName: string;

  @IsString()
  serviceCode: string;

  @IsNumber()
  baseRate: number;

  @ValidateNested({ each: true })
  @Type(() => SurchargeDto)
  surcharges: SurchargeDto[];

  @IsNumber()
  totalCost: number;

  @IsString()
  currency: string;

  @IsDate()
  @Type(() => Date)
  estimatedDeliveryDate: Date;

  @IsNumber()
  transitDays: number;

  @IsNumber()
  @IsOptional()
  reliabilityScore?: number;

  @IsBoolean()
  @IsOptional()
  isCheapest?: boolean;

  @IsBoolean()
  @IsOptional()
  isFastest?: boolean;
}
