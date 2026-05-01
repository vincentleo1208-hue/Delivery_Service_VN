export interface City {
  name: string;
  state?: string;
  country: string;
  zipCode?: string;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lb' | 'kg';
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'in' | 'cm';
}

export interface RateQuote {
  id: string;
  carrierId: string;
  carrierName: string;
  serviceName: string;
  serviceCode: string;
  baseRate: number;
  surcharges: Array<{ name: string; amount: number }>;
  totalCost: number;
  currency: string;
  estimatedDeliveryDate: string;
  transitDays: number;
  reliabilityScore: number;
  directLink?: string;
}

export interface QuoteRequest {
  origin: Address;
  destination: Address;
  weight: number;
  weightUnit: 'lb' | 'kg';
  packageType?: string;
  packages?: PackageDetails[];
  isGuaranteed?: boolean;
  hasFoodSupplements?: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  name?: string;
  pickupAddress?: Address;
}
