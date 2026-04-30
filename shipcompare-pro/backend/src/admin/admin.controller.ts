import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { PricingService } from '../pricing/pricing.service';
import {
  CreateCarrierPricingDto,
  BulkUploadPricingDto,
  PricingFilterDto,
} from '../pricing/dto/pricing.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/admin/pricing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminPricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  @Roles('admin', 'owner')
  async findAll(@Query() filters: PricingFilterDto) {
    return this.pricingService.findAll(filters);
  }

  @Get(':id')
  @Roles('admin', 'owner')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingService.findOne(id);
  }

  @Post()
  @Roles('admin', 'owner')
  async create(
    @Body() createPricingDto: CreateCarrierPricingDto,
    @Req() req: any,
  ) {
    const user: User = req.user;
    return this.pricingService.create(createPricingDto, user);
  }

  @Post('bulk')
  @Roles('admin', 'owner')
  async bulkUpload(@Body() bulkUploadDto: BulkUploadPricingDto, @Req() req: any) {
    const user: User = req.user;
    return this.pricingService.bulkUpload(bulkUploadDto, user);
  }

  @Get('export/csv')
  @Roles('admin', 'owner')
  async exportCSV(@Res() res: Response) {
    const csv = await this.pricingService.exportToCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=carrier-pricing-${new Date().toISOString().split('T')[0]}.csv`,
    );
    res.send(csv);
  }

  @Get('template/csv')
  @Roles('admin', 'owner')
  async downloadTemplate(@Res() res: Response) {
    const headers = [
      'carrier',
      'serviceCode',
      'zone',
      'baseRate',
      'fuelSurchargePercent',
      'residentialSurcharge',
      'signatureRequiredFee',
      'saturdayDeliveryFee',
      'oversizeFee',
      'minWeightLbs',
      'maxWeightLbs',
      'pricingTier',
      'isActive',
      'notes',
    ];

    const exampleRows = [
      [
        'fedex',
        'ground',
        'domestic',
        '8.50',
        '15.5',
        '4.95',
        '6.25',
        '12.50',
        '80.00',
        '1',
        '150',
        'standard',
        'true',
        'Standard ground shipping',
      ],
      [
        'fedex',
        '2day',
        'domestic',
        '15.75',
        '15.5',
        '4.95',
        '6.25',
        '12.50',
        '80.00',
        '1',
        '150',
        'standard',
        'true',
        '2-day delivery',
      ],
      [
        'ups',
        'ground',
        'domestic',
        '8.25',
        '14.8',
        '4.85',
        '6.15',
        '12.00',
        '75.00',
        '1',
        '150',
        'standard',
        'true',
        'UPS Ground service',
      ],
    ];

    const csvContent = [headers.join(','), ...exampleRows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=pricing-upload-template.csv',
    );
    res.send(csvContent);
  }

  @Post(':id/toggle')
  @Roles('admin', 'owner')
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingService.toggleStatus(id);
  }
}
