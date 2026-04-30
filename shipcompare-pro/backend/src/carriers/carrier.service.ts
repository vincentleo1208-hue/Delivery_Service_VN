import { Injectable } from '@nestjs/common';
import { ShipmentInput, QuoteResult } from '../quotes/quotes.service';

/**
 * Carrier Adapter Interface
 * All carrier integrations must implement this interface
 */
export interface ICarrierAdapter {
  getCarrierName(): string;
  getRates(shipment: ShipmentInput): Promise<QuoteResult[]>;
  purchaseLabel(quote: QuoteResult): Promise<PurchaseLabelResult>;
  getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]>;
}

export interface PurchaseLabelResult {
  trackingNumber: string;
  labelUrl: string;
  cost: number;
  createdAt: Date;
}

export interface TrackingEvent {
  timestamp: Date;
  location: string;
  description: string;
  status: string;
}

@Injectable()
export class CarrierService {
  constructor(
    private readonly fedexAdapter: ICarrierAdapter,
    private readonly upsAdapter: ICarrierAdapter,
    private readonly dhlAdapter: ICarrierAdapter,
    private readonly uspsAdapter: ICarrierAdapter,
  ) {}

  private getAdapters(): ICarrierAdapter[] {
    return [
      this.fedexAdapter,
      this.upsAdapter,
      this.dhlAdapter,
      this.uspsAdapter,
    ];
  }

  /**
   * Fan out requests to all carriers in parallel
   * Uses Promise.allSettled to handle partial failures gracefully
   */
  async getRatesFromAllCarriers(shipment: ShipmentInput): Promise<(QuoteResult | null)[]> {
    const adapters = this.getAdapters();
    
    const results = await Promise.allSettled(
      adapters.map(adapter => adapter.getRates(shipment)),
    );

    const allQuotes: (QuoteResult | null)[] = [];

    results.forEach((result, index) => {
      const carrierName = adapters[index].getCarrierName();
      
      if (result.status === 'fulfilled') {
        allQuotes.push(...result.value);
      } else {
        // Log error but don't block other carriers
        console.error(`Failed to get rates from ${carrierName}:`, result.reason);
        allQuotes.push(null);
      }
    });

    return allQuotes.filter(q => q !== null);
  }

  async getCarrierByName(name: string): Promise<ICarrierAdapter | null> {
    const adapters = this.getAdapters();
    return adapters.find(a => a.getCarrierName().toLowerCase() === name.toLowerCase()) || null;
  }
}
