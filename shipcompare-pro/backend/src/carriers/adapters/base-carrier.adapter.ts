import { ICarrierAdapter, TrackingEvent } from '../interfaces/carrier-adapter.interface';
import { ShipmentInput } from '../../quotes/dto/shipment-input.dto';
import { QuoteResult } from '../../quotes/dto/quote-result.dto';

/**
 * Abstract base class for carrier adapters.
 * Provides common functionality and enforces interface implementation.
 */
export abstract class BaseCarrierAdapter implements ICarrierAdapter {
  abstract readonly carrierId: string;
  abstract readonly carrierName: string;

  /**
   * Normalize address to carrier-specific format.
   * Override in subclasses if carrier requires special formatting.
   */
  protected normalizeAddress(address: ShipmentInput['origin']): Record<string, unknown> {
    return {
      street1: address.street1,
      street2: address.street2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isResidential: address.isResidential ?? false,
    };
  }

  /**
   * Calculate surcharges based on shipment characteristics.
   * Override in subclasses with carrier-specific rules.
   */
  protected calculateSurcharges(
    baseRate: number,
    shipment: ShipmentInput,
  ): { surcharges: Array<{ name: string; amount: number }>; total: number } {
    const surcharges: Array<{ name: string; amount: number }> = [];
    
    // Fuel surcharge (example - carriers have different rates)
    const fuelSurcharge = baseRate * 0.15; // 15% example
    surcharges.push({ name: 'Fuel Surcharge', amount: parseFloat(fuelSurcharge.toFixed(2)) });

    // Residential delivery surcharge
    if (shipment.destination.isResidential) {
      const residentialSurcharge = 4.50;
      surcharges.push({ name: 'Residential Delivery', amount: residentialSurcharge });
    }

    // Calculate total
    const total = baseRate + surcharges.reduce((sum, s) => sum + s.amount, 0);

    return { surcharges, total: parseFloat(total.toFixed(2)) };
  }

  abstract getRates(shipment: ShipmentInput): Promise<QuoteResult[]>;
  abstract purchaseLabel(quoteId: string, paymentMethodId: string): Promise<{
    labelUrl: string;
    trackingNumber: string;
    labelFormat: string;
  }>;
  abstract getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]>;
}
