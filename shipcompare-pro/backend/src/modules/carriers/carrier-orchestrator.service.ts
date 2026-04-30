import { Injectable, Logger } from '@nestjs/common';
import { ICarrierAdapter } from './carrier-adapter.interface';
import { ShipmentInput, QuoteResult, TrackingEvent } from '../../common/types';

@Injectable()
export class CarrierOrchestratorService {
  private readonly logger = new Logger(CarrierOrchestratorService.name);
  private readonly adapters: Record<string, ICarrierAdapter>;

  constructor(
    private readonly fedexAdapter: FedexAdapter,
    private readonly upsAdapter: UpsAdapter,
    private readonly dhlAdapter: DhlAdapter,
    private readonly uspsAdapter: UspsAdapter,
  ) {
    this.adapters = {
      fedex: this.fedexAdapter,
      ups: this.upsAdapter,
      dhl: this.dhlAdapter,
      usps: this.uspsAdapter,
    };
  }

  async getRatesFromAllCarriers(input: ShipmentInput): Promise<QuoteResult[]> {
    const carrierNames = Object.keys(this.adapters);
    
    const results = await Promise.allSettled(
      carrierNames.map((carrier) =>
        this.adapters[carrier].getRates(input).catch((error) => {
          this.logger.error(`Error getting rates from ${carrier}:`, error);
          return [];
        }),
      ),
    );

    const allQuotes: QuoteResult[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allQuotes.push(...result.value);
      } else {
        this.logger.warn(`Carrier ${carrierNames[index]} failed to return quotes`);
      }
    });

    // Sort by total cost ascending
    return allQuotes.sort((a, b) => a.totalCost - b.totalCost);
  }

  async purchaseLabel(carrier: string, quote: QuoteResult) {
    const adapter = this.adapters[carrier];
    if (!adapter) {
      throw new Error(`Carrier ${carrier} not supported`);
    }
    return adapter.purchaseLabel(quote);
  }

  async getTrackingEvents(carrier: string, trackingNumber: string) {
    const adapter = this.adapters[carrier];
    if (!adapter) {
      throw new Error(`Carrier ${carrier} not supported`);
    }
    return adapter.getTrackingEvents(trackingNumber);
  }
}
