import { Module } from '@nestjs/common';
import { CarrierOrchestratorService } from './carrier-orchestrator.service';
import { FedexAdapter } from './adapters/fedex.adapter';
import { UpsAdapter } from './adapters/ups.adapter';
import { DhlAdapter } from './adapters/dhl.adapter';
import { UspsAdapter } from './adapters/usps.adapter';

@Module({
  providers: [
    CarrierOrchestratorService,
    FedexAdapter,
    UpsAdapter,
    DhlAdapter,
    UspsAdapter,
  ],
  exports: [CarrierOrchestratorService],
})
export class CarriersModule {}
