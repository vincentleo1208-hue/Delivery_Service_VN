import { Module } from '@nestjs/common';
import { FedExAdapter } from './adapters/fedex.adapter';
import { CarriersService } from './carriers.service';

@Module({
  providers: [FedExAdapter, CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
