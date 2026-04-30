import { IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PackageType {
  PARCEL = 'parcel',
  ENVELOPE = 'envelope',
  PALLET = 'pallet',
}

export class AddressDto {
  @IsString()
  street1: string;

  @IsString()
  @IsOptional()
  street2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsString()
  country: string;

  @IsBoolean()
  @IsOptional()
  isResidential?: boolean;
}

export class PackageDimensionsDto {
  @IsNumber()
  @Min(1)
  length: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsString()
  @IsOptional()
  unit?: 'in' | 'cm';
}

export class ShipmentInput {
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @IsNumber()
  @Min(0.1)
  weight: number;

  @IsString()
  @IsOptional()
  weightUnit?: 'lb' | 'kg';

  @ValidateNested()
  @IsOptional()
  @Type(() => PackageDimensionsDto)
  dimensions?: PackageDimensionsDto;

  @IsEnum(PackageType)
  @IsOptional()
  packageType?: PackageType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  declaredValue?: number;

  @IsBoolean()
  @IsOptional()
  signatureRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  isHazmat?: boolean;

  @IsBoolean()
  @IsOptional()
  saturdayDelivery?: boolean;

  @IsString()
  @IsOptional()
  preferredDeliveryDate?: string;
}
