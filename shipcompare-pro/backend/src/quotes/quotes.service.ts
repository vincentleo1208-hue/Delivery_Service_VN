import { Injectable } from '@nestjs/common';
import { CarrierService } from '../carriers/carrier.service';

export interface ShipmentInput {
  origin: Address;
  destination: Address;
  package: PackageDetails;
  options?: ShipmentOptions;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isResidential?: boolean;
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lb' | 'kg';
  length: number;
  width: number;
  height: number;
  dimensionUnit: 'in' | 'cm';
  packageType?: 'parcel' | 'envelope' | 'pallet';
}

export interface ShipmentOptions {
  declaredValue?: number;
  signatureRequired?: boolean;
  hazmat?: boolean;
  saturdayDelivery?: boolean;
  deliveryDate?: string;
}

export interface QuoteResult {
  id: string;
  carrier: string;
  serviceName: string;
  baseRate: number;
  surcharges: Surcharge[];
  totalCost: number;
  currency: string;
  estimatedDeliveryDate: string;
  transitDays: number;
  reliabilityScore?: number;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

export interface Surcharge {
  type: string;
  description: string;
  amount: number;
}

@Injectable()
export class QuotesService {
  constructor(private readonly carrierService: CarrierService) {}

  async getQuotes(shipmentInput: ShipmentInput): Promise<QuoteResult[]> {
    // Fan out requests to all carriers in parallel
    const results = await this.carrierService.getRatesFromAllCarriers(shipmentInput);
    
    // Filter out failed requests and sort by total cost
    const successfulQuotes = results
      .filter((result): result is QuoteResult => result !== null)
      .sort((a, b) => a.totalCost - b.totalCost);

    return successfulQuotes;
  }

  async getCachedQuote(quoteId: string): Promise<QuoteResult | null> {
    // TODO: Implement Redis caching
    return null;
  }

  private generateQuoteId(): string {
    return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
