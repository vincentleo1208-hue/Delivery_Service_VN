import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { ICarrierAdapter, TrackingEvent } from '../interfaces/carrier-adapter.interface';
import { ShipmentInput } from '../../quotes/dto/shipment-input.dto';
import { QuoteResult } from '../../quotes/dto/quote-result.dto';

/**
 * ShipCompare Pro Consolidated Shipping Adapter
 * 
 * This adapter provides consolidated shipping services by leveraging bulk shipping agreements.
 * We act as brokers, combining multiple customer shipments into larger consolidated shipments
 * to nearest hubs in destination countries, then using local carriers for final delivery.
 * 
 * Benefits:
 * - Lower prices than retail due to bulk negotiated rates
 * - Customer shipment stays intact (never separated)
 * - We handle all broker/dealer relationships with carriers
 */
@Injectable()
export class ConsolidatedAdapter extends BaseCarrierAdapter implements ICarrierAdapter {
  readonly carrierId = 'shipcompare-consolidated';
  readonly carrierName = 'ShipCompare Pro Consolidated';

  // Broker discount rates based on our negotiated bulk shipping agreements
  private readonly brokerDiscountRates = {
    domestic: 0.25, // 25% discount off retail for domestic
    international: 0.35, // 35% discount off retail for international
    express: 0.20, // 20% discount for express services
  };

  // Consolidation hub locations by region
  private readonly consolidationHubs = {
    US: ['LAX', 'JFK', 'ORD', 'DFW', 'MIA'],
    EU: ['LHR', 'CDG', 'FRA', 'AMS'],
    ASIA: ['NRT', 'ICN', 'SIN', 'HKG'],
    CA: ['YYZ', 'YVR', 'YUL'],
    MX: ['MEX', 'GDL'],
    AU: ['SYD', 'MEL'],
  };

  async getRates(shipment: ShipmentInput): Promise<QuoteResult[]> {
    const isInternational = shipment.origin.country !== shipment.destination.country;
    
    // Determine the discount rate based on shipment type
    let baseDiscount = isInternational 
      ? this.brokerDiscountRates.international 
      : this.brokerDiscountRates.domestic;

    // Generate consolidated shipping options
    const consolidatedRates: QuoteResult[] = [];

    // Economy Consolidated Service (7-14 days)
    const economyTransitDays = isInternational ? 10 : 5;
    const economyBaseRate = this.calculateConsolidatedRate(shipment, economyTransitDays, baseDiscount);
    consolidatedRates.push({
      id: `sc-consolidated-economy-${Date.now()}`,
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceName: 'Consolidated Economy',
      serviceCode: 'CONSOLIDATED_ECONOMY',
      baseRate: economyBaseRate,
      surcharges: this.calculateConsolidatedSurcharges(economyBaseRate, shipment, false),
      totalCost: 0, // Will be calculated after surcharges
      currency: 'USD',
      estimatedDeliveryDate: new Date(Date.now() + economyTransitDays * 24 * 60 * 60 * 1000),
      transitDays: economyTransitDays,
      reliabilityScore: 0.92,
    });

    // Standard Consolidated Service (5-7 days domestic, 7-10 days international)
    const standardTransitDays = isInternational ? 8 : 3;
    const standardBaseRate = this.calculateConsolidatedRate(shipment, standardTransitDays, baseDiscount * 0.9);
    consolidatedRates.push({
      id: `sc-consolidated-standard-${Date.now()}`,
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceName: 'Consolidated Standard',
      serviceCode: 'CONSOLIDATED_STANDARD',
      baseRate: standardBaseRate,
      surcharges: this.calculateConsolidatedSurcharges(standardBaseRate, shipment, false),
      totalCost: 0,
      currency: 'USD',
      estimatedDeliveryDate: new Date(Date.now() + standardTransitDays * 24 * 60 * 60 * 1000),
      transitDays: standardTransitDays,
      reliabilityScore: 0.95,
    });

    // Express Consolidated Service (2-3 days domestic, 4-6 days international)
    const expressTransitDays = isInternational ? 5 : 2;
    const expressDiscount = this.brokerDiscountRates.express;
    const expressBaseRate = this.calculateConsolidatedRate(shipment, expressTransitDays, expressDiscount);
    consolidatedRates.push({
      id: `sc-consolidated-express-${Date.now()}`,
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceName: 'Consolidated Express',
      serviceCode: 'CONSOLIDATED_EXPRESS',
      baseRate: expressBaseRate,
      surcharges: this.calculateConsolidatedSurcharges(expressBaseRate, shipment, true),
      totalCost: 0,
      currency: 'USD',
      estimatedDeliveryDate: new Date(Date.now() + expressTransitDays * 24 * 60 * 60 * 1000),
      transitDays: expressTransitDays,
      reliabilityScore: 0.97,
    });

    // Calculate final total costs including surcharges
    consolidatedRates.forEach(rate => {
      const surchargeTotal = rate.surcharges.reduce((sum, s) => sum + s.amount, 0);
      rate.totalCost = parseFloat((rate.baseRate + surchargeTotal).toFixed(2));
    });

    return consolidatedRates;
  }

  /**
   * Calculate consolidated rate based on weight, distance, and broker discounts
   */
  private calculateConsolidatedRate(
    shipment: ShipmentInput,
    transitDays: number,
    discount: number,
  ): number {
    // Base rate calculation factors
    const weight = shipment.weight;
    const weightUnit = shipment.weightUnit || 'lb';
    const weightInLbs = weightUnit === 'kg' ? weight * 2.20462 : weight;

    // Base rate per pound (varies by speed)
    let baseRatePerLb: number;
    if (transitDays <= 3) {
      baseRatePerLb = 2.50; // Express
    } else if (transitDays <= 7) {
      baseRatePerLb = 1.75; // Standard
    } else {
      baseRatePerLb = 1.25; // Economy
    }

    // Calculate base rate
    let baseRate = weightInLbs * baseRatePerLb;

    // Add international premium if applicable
    const isInternational = shipment.origin.country !== shipment.destination.country;
    if (isInternational) {
      baseRate *= 1.5; // 50% premium for international
    }

    // Apply broker discount
    baseRate = baseRate * (1 - discount);

    // Minimum charge
    const minCharge = isInternational ? 15.00 : 8.00;
    baseRate = Math.max(baseRate, minCharge);

    return parseFloat(baseRate.toFixed(2));
  }

  /**
   * Calculate surcharges for consolidated shipments
   */
  private calculateConsolidatedSurcharges(
    baseRate: number,
    shipment: ShipmentInput,
    isExpress: boolean,
  ): Array<{ name: string; amount: number }> {
    const surcharges: Array<{ name: string; amount: number }> = [];

    // Fuel surcharge (lower than retail due to bulk purchasing)
    const fuelSurcharge = baseRate * 0.10; // 10% vs typical 15%
    surcharges.push({ 
      name: 'Fuel Surcharge', 
      amount: parseFloat(fuelSurcharge.toFixed(2)) 
    });

    // Residential delivery (waived for consolidated due to hub delivery)
    // We absorb this cost as part of our brokerage model
    // if (shipment.destination.isResidential && !isExpress) {
    //   surcharges.push({ name: 'Residential Delivery', amount: 2.50 }); // Reduced from $4.50
    // }

    // Consolidation handling fee (small fee for our service)
    const handlingFee = 2.00;
    surcharges.push({ name: 'Consolidation Handling', amount: handlingFee });

    // Signature required (optional)
    if (shipment.signatureRequired) {
      surcharges.push({ name: 'Signature Confirmation', amount: 3.50 });
    }

    // Saturday delivery (only for express)
    if (shipment.saturdayDelivery && isExpress) {
      surcharges.push({ name: 'Saturday Delivery', amount: 8.00 });
    }

    // Hazmat handling
    if (shipment.isHazmat) {
      surcharges.push({ name: 'Hazmat Handling', amount: 25.00 });
    }

    return surcharges;
  }

  /**
   * Get the consolidation hub for a destination country
   */
  private getConsolidationHub(countryCode: string): string {
    const countryUpper = countryCode.toUpperCase();
    
    if (['US'].includes(countryUpper)) {
      return this.consolidationHubs.US[0];
    } else if (['GB', 'FR', 'DE', 'NL', 'IT', 'ES'].includes(countryUpper)) {
      return this.consolidationHubs.EU[0];
    } else if (['JP', 'KR', 'SG', 'HK', 'CN'].includes(countryUpper)) {
      return this.consolidationHubs.ASIA[0];
    } else if (['CA'].includes(countryUpper)) {
      return this.consolidationHubs.CA[0];
    } else if (['MX'].includes(countryUpper)) {
      return this.consolidationHubs.MX[0];
    } else if (['AU', 'NZ'].includes(countryUpper)) {
      return this.consolidationHubs.AU[0];
    }
    
    // Default to nearest major hub
    return 'JFK';
  }

  async purchaseLabel(quoteId: string, paymentMethodId: string): Promise<{
    labelUrl: string;
    trackingNumber: string;
    labelFormat: string;
  }> {
    // TODO: Implement actual label generation for consolidated shipments
    // This would involve:
    // 1. Creating internal tracking number
    // 2. Generating shipping label with our branding
    // 3. Assigning to appropriate consolidation batch
    // 4. Scheduling pickup to consolidation hub
    
    return {
      labelUrl: 'https://example.com/labels/sc-consolidated-12345.pdf',
      trackingNumber: `SC${Date.now()}US`,
      labelFormat: 'PDF',
    };
  }

  async getTrackingEvents(trackingNumber: string): Promise<TrackingEvent[]> {
    // TODO: Implement tracking for consolidated shipments
    // This would track:
    // 1. Pickup from sender
    // 2. Arrival at origin consolidation hub
    // 3. Departure on consolidated shipment
    // 4. Arrival at destination hub
    // 5. Handoff to local carrier
    // 6. Final delivery
    
    return [
      {
        timestamp: new Date(),
        location: 'Origin Consolidation Hub',
        description: 'Shipment received at consolidation facility',
        status: 'in_transit',
        rawCarrierCode: 'IT',
      },
    ];
  }
}
