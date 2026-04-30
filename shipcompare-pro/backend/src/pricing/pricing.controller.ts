import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { PricingService } from './pricing.service';
import {
  CreateCarrierPricingDto,
  UpdateCarrierPricingDto,
  BulkUploadPricingDto,
  PricingFilterDto,
} from './dto/pricing.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/pricing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post()
  @Roles('admin', 'owner')
  async create(
    @Body() createPricingDto: CreateCarrierPricingDto,
    @Req() req: any,
  ) {
    const user: User = req.user;
    return this.pricingService.create(createPricingDto, user);
  }

  @Get()
  @Roles('admin', 'owner', 'team_member')
  async findAll(@Query() filters: PricingFilterDto) {
    return this.pricingService.findAll(filters);
  }

  @Get(':id')
  @Roles('admin', 'owner', 'team_member')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'owner')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePricingDto: UpdateCarrierPricingDto,
    @Req() req: any,
  ) {
    const user: User = req.user;
    return this.pricingService.update(id, updatePricingDto, user);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingService.remove(id);
  }

  @Post('bulk')
  @Roles('admin', 'owner')
  async bulkUpload(@Body() bulkUploadDto: BulkUploadPricingDto, @Req() req: any) {
    const user: User = req.user;
    return this.pricingService.bulkUpload(bulkUploadDto, user);
  }

  @Post(':id/toggle')
  @Roles('admin', 'owner')
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingService.toggleStatus(id);
  }

  @Get('export/csv')
  @Roles('admin', 'owner', 'team_member')
  async exportCSV(@Res() res: Response) {
    const csv = await this.pricingService.exportToCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=carrier-pricing-${new Date().toISOString().split('T')[0]}.csv`,
    );
    res.send(csv);
  }

  @Get('carrier/:carrier')
  @Roles('admin', 'owner', 'team_member')
  async getByCarrier(@Param('carrier') carrier: string) {
    return this.pricingService.getActivePricingByCarrier(carrier);
  }
}
