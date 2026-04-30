import { Injectable, Logger } from '@nestjs/common';
import { CarrierOrchestratorService } from '../carriers/carrier-orchestrator.service';
import { ShipmentInput, QuoteResult } from '../../common/types';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(private readonly carrierOrchestrator: CarrierOrchestratorService) {}

  async getRates(input: ShipmentInput): Promise<QuoteResult[]> {
    this.logger.log('Getting rates from all carriers');
    return this.carrierOrchestrator.getRatesFromAllCarriers(input);
  }

  async getCachedQuote(quoteId: string): Promise<QuoteResult[] | null> {
    // TODO: Implement Redis caching
    return null;
  }
}
