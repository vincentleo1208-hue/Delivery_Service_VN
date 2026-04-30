import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  async findAll(@Query('userId') userId: string, @Query() filters?: any) {
    return this.shipmentsService.findAll(userId, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Get(':id/tracking')
  async getTracking(@Param('id') id: string) {
    return this.shipmentsService.getTrackingEvents(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.shipmentsService.create(body);
  }
}
