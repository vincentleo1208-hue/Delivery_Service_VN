import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.dto';
import { Lead, LeadStatus } from './lead.entity';

@Controller('leads')
export class LeadsController {
  private readonly logger = new Logger(LeadsController.name);

  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Public endpoint to create a lead (for the "Open Router Rate" flow)
   * This is called when a user provides contact info to receive actual pricing
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadDto: CreateLeadDto): Promise<{
    id: string;
    message: string;
  }> {
    this.logger.log(`Received lead submission from ${createLeadDto.email}`);
    const lead = await this.leadsService.create(createLeadDto);
    return {
      id: lead.id,
      message: 'Thank you! Our sales team will contact you shortly.',
    };
  }

  /**
   * Get all leads (admin only - should be protected by auth guard in production)
   */
  @Get()
  async findAll(@Query('status') status?: LeadStatus): Promise<Lead[]> {
    return await this.leadsService.findAll(status);
  }

  /**
   * Get a specific lead by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Lead | null> {
    return await this.leadsService.findOne(id);
  }

  /**
   * Update lead status (admin only)
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateLeadStatusDto: UpdateLeadStatusDto,
  ): Promise<Lead | null> {
    return await this.leadsService.updateStatus(id, updateLeadStatusDto);
  }

  /**
   * Delete a lead (admin only)
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.leadsService.remove(id);
  }
}
