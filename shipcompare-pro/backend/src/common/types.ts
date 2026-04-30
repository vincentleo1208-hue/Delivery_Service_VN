import { Injectable } from '@nestjs/common';

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
  isResidential: boolean;
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lb' | 'kg';
  length: number;
  width: number;
  height: number;
  dimensionUnit: 'in' | 'cm';
  packageType: 'parcel' | 'envelope' | 'pallet';
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
  carrier: CarrierName;
  serviceName: string;
  baseRate: number;
  surcharges: Surcharge[];
  totalCost: number;
  estimatedDeliveryDate: string;
  transitDays: number;
  reliabilityScore?: number;
  currency: string;
}

export interface Surcharge {
  type: string;
  amount: number;
  description: string;
}

export type CarrierName = 'fedex' | 'ups' | 'dhl' | 'usps' | 'ontrac' | 'canada-post';

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
}
