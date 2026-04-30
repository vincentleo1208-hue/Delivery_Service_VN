import { ShipmentInput, QuoteResult, TrackingEvent } from '../../common/types';

export interface ICarrierAdapter {
  getRates(input: ShipmentInput): Promise<QuoteResult[]>;
  purchaseLabel(quote: QuoteResult): Promise<{ trackingNumber: string; labelUrl: string }>;
  getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]>;
}
