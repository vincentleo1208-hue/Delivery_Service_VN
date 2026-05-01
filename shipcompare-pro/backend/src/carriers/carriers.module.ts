import { Module } from '@nestjs/common';
import { FedExAdapter } from './adapters/fedex.adapter';
import { UPSAdapter } from './adapters/ups.adapter';
import { DHLAdapter } from './adapters/dhl.adapter';
import { USPSAdapter } from './adapters/usps.adapter';
import { ConsolidatedAdapter } from './adapters/consolidated.adapter';
import { CarriersService } from './carriers.service';

@Module({
  providers: [FedExAdapter, UPSAdapter, DHLAdapter, USPSAdapter, ConsolidatedAdapter, CarriersService],
  exports: [CarriersService],
})
export class CarriersModule {}
