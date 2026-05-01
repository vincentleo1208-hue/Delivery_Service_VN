import { IsString, IsOptional, IsEmail, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  phone: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  pickupAddress?: string;

  @IsString()
  @IsOptional()
  quoteSessionId?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Object)
  shipmentDetails?: Record<string, any>;
}
