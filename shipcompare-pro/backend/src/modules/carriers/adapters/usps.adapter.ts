import { Injectable, Logger } from '@nestjs/common';
import { ICarrierAdapter } from './carrier-adapter.interface';
import { ShipmentInput, QuoteResult, TrackingEvent } from '../../common/types';

@Injectable()
export class UspsAdapter implements ICarrierAdapter {
  private readonly logger = new Logger(UspsAdapter.name);

  async getRates(input: ShipmentInput): Promise<QuoteResult[]> {
    this.logger.log('Getting rates from USPS API');
    return [];
  }

  async purchaseLabel(quote: QuoteResult): Promise<{ trackingNumber: string; labelUrl: string }> {
    this.logger.log('Purchasing label from USPS');
    return { trackingNumber: '', labelUrl: '' };
  }

  async getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]> {
    this.logger.log(`Getting tracking events for ${trackingNumber}`);
    return [];
  }
}
