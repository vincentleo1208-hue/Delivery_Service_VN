import { Module } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { FedExAdapter } from './adapters/fedex.adapter';
import { UPSAdapter } from './adapters/ups.adapter';
import { DHLAdapter } from './adapters/dhl.adapter';
import { USPSAdapter } from './adapters/usps.adapter';

@Module({
  providers: [
    CarrierService,
    FedExAdapter,
    UPSAdapter,
    DHLAdapter,
    USPSAdapter,
  ],
  exports: [CarrierService],
})
export class CarriersModule {}
