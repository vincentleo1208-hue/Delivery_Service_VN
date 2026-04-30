import { Injectable, Logger } from '@nestjs/common';
import { ICarrierAdapter } from './carrier-adapter.interface';
import { ShipmentInput, QuoteResult, TrackingEvent } from '../../common/types';

@Injectable()
export class DhlAdapter implements ICarrierAdapter {
  private readonly logger = new Logger(DhlAdapter.name);

  async getRates(input: ShipmentInput): Promise<QuoteResult[]> {
    this.logger.log('Getting rates from DHL API');
    return [];
  }

  async purchaseLabel(quote: QuoteResult): Promise<{ trackingNumber: string; labelUrl: string }> {
    this.logger.log('Purchasing label from DHL');
    return { trackingNumber: '', labelUrl: '' };
  }

  async getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]> {
    this.logger.log(`Getting tracking events for ${trackingNumber}`);
    return [];
  }
}
