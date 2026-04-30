import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @Post()
  async create(@Body() body: { userId: string; addressData: any }) {
    return this.addressesService.create(body.userId, body.addressData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() addressData: any) {
    return this.addressesService.update(id, addressData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.addressesService.delete(id);
  }
}
