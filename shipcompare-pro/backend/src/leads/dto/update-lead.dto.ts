import { IsString, IsOptional, IsEnum } from 'class-validator';
import { LeadStatus } from '../lead.entity';

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
