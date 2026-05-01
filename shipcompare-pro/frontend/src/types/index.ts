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
  state: string; // Made required to match backend
  zip: string;
  country: string;
  isResidential?: boolean;
}

export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  unit?: 'in' | 'cm';
}

export interface PackageDetails {
  weight: number;
  weightUnit: 'lb' | 'kg';
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: 'in' | 'cm';
  dimensions?: PackageDimensions;
  packageType?: 'parcel' | 'envelope' | 'pallet';
}

export interface Surcharge {
  name: string;
  amount: number;
}

export interface RateQuote {
  id: string;
  carrierId: string;
  carrierName: string;
  serviceName: string;
  serviceCode: string;
  baseRate: number;
  surcharges: Surcharge[];
  totalCost: number;
  currency: string;
  estimatedDeliveryDate: string; // Keep as string for frontend display
  transitDays: number;
  reliabilityScore?: number;
  isCheapest?: boolean;
  isFastest?: boolean;
  directLink?: string;
}

export interface QuoteRequest {
  origin: Address;
  destination: Address;
  weight: number;
  weightUnit?: 'lb' | 'kg';
  packages?: PackageDetails[];
  dimensions?: PackageDimensions;
  packageType?: 'parcel' | 'envelope' | 'pallet';
  declaredValue?: number;
  isHighValue?: boolean; // Renamed from isGuaranteed to match backend
  containsFoodOrSupplements?: boolean; // Renamed from hasFoodSupplements to match backend
  signatureRequired?: boolean;
  isHazmat?: boolean;
  saturdayDelivery?: boolean;
  preferredDeliveryDate?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  name?: string;
  pickupAddress?: string;
}

export interface LeadSubmission {
  email: string;
  phone: string;
  name?: string;
  pickupAddress?: string;
  quoteSessionId?: string;
  shipmentDetails?: Record<string, any>;
}
