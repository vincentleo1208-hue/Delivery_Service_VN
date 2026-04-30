import { ShipmentInput } from '../../quotes/dto/shipment-input.dto';
import { QuoteResult } from '../../quotes/dto/quote-result.dto';

/**
 * Interface for carrier adapter implementations.
 * Each carrier (FedEx, UPS, DHL, USPS, etc.) must implement this interface.
 */
export interface ICarrierAdapter {
  /**
   * Carrier identifier (e.g., 'fedex', 'ups', 'dhl', 'usps')
   */
  readonly carrierId: string;

  /**
   * Carrier display name (e.g., 'FedEx', 'UPS', 'DHL Express')
   */
  readonly carrierName: string;

  /**
   * Get shipping rates for a given shipment.
   * @param shipment - The shipment details
   * @returns Promise resolving to an array of quote results
   */
  getRates(shipment: ShipmentInput): Promise<QuoteResult[]>;

  /**
   * Purchase a shipping label for a selected quote.
   * @param quoteId - The ID of the selected quote
   * @param paymentMethodId - Stripe payment method ID
   * @returns Object containing label URL and tracking number
   */
  purchaseLabel(quoteId: string, paymentMethodId: string): Promise<{
    labelUrl: string;
    trackingNumber: string;
    labelFormat: string;
  }>;

  /**
   * Get tracking events for a shipment.
   * @param trackingNumber - The carrier tracking number
   * @returns Array of tracking events
   */
  getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]>;
}

/**
 * Tracking event structure returned by carriers.
 */
export interface TrackingEvent {
  timestamp: Date;
  location: string;
  description: string;
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  rawCarrierCode?: string;
}
