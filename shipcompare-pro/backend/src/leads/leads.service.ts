import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);
    const savedLead = await this.leadRepository.save(lead);
    this.logger.log(`Created new lead: ${savedLead.id} (${savedLead.email})`);
    return savedLead;
  }

  async findAll(status?: LeadStatus): Promise<Lead[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return await this.leadRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lead | null> {
    return await this.leadRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, updateLeadStatusDto: UpdateLeadStatusDto): Promise<Lead | null> {
    const lead = await this.leadRepository.findOne({ where: { id } });
    if (!lead) {
      return null;
    }

    lead.status = updateLeadStatusDto.status;
    if (updateLeadStatusDto.notes) {
      lead.notes = updateLeadStatusDto.notes;
    }

    const updatedLead = await this.leadRepository.save(lead);
    this.logger.log(`Updated lead ${id} status to ${updatedLead.status}`);
    return updatedLead;
  }

  async remove(id: string): Promise<void> {
    await this.leadRepository.delete(id);
    this.logger.log(`Deleted lead: ${id}`);
  }

  async findByEmail(email: string): Promise<Lead[]> {
    return await this.leadRepository.find({
      where: { email },
      order: { createdAt: 'DESC' },
    });
  }
}
