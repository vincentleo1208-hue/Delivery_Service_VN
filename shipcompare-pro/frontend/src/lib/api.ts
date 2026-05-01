import { QuoteRequest, RateQuote, LeadSubmission } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiService {
  /**
   * Get shipping quotes from the backend
   */
  static async getQuotes(shipmentData: QuoteRequest): Promise<RateQuote[]> {
    const response = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        weight: shipmentData.weight,
        weightUnit: shipmentData.weightUnit || 'lb',
        packages: shipmentData.packages,
        dimensions: shipmentData.dimensions,
        packageType: shipmentData.packageType,
        declaredValue: shipmentData.declaredValue,
        isHighValue: shipmentData.isHighValue,
        containsFoodOrSupplements: shipmentData.containsFoodOrSupplements,
        signatureRequired: shipmentData.signatureRequired,
        isHazmat: shipmentData.isHazmat,
        saturdayDelivery: shipmentData.saturdayDelivery,
        preferredDeliveryDate: shipmentData.preferredDeliveryDate,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to get quotes' }));
      throw new Error(error.message || 'Failed to get quotes');
    }

    const data = await response.json();
    
    // Backend returns: { quotes, expiresAt, quoteSessionId, openRouterRate }
    // We need to combine regular quotes with openRouterRate if present
    const allQuotes: any[] = [...(data.quotes || [])];
    
    // Add Open Router rate as a separate quote option if it exists
    if (data.openRouterRate) {
      allQuotes.push({
        ...data.openRouterRate,
        carrierId: 'shipcompare-consolidated',
        carrierName: 'ShipCompare Open Router',
        serviceCode: 'OPEN_ROUTER_BEST',
      });
    }
    
    // Convert Date objects to strings for frontend compatibility
    return allQuotes.map((quote: any) => ({
      ...quote,
      estimatedDeliveryDate: quote.estimatedDeliveryDate 
        ? new Date(quote.estimatedDeliveryDate).toISOString().split('T')[0] 
        : '',
    }));
  }

  /**
   * Submit a lead/contact form
   */
  static async submitLead(leadData: LeadSubmission): Promise<{ id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: leadData.email,
        phone: leadData.phone,
        name: leadData.name,
        pickupAddress: leadData.pickupAddress,
        quoteSessionId: leadData.quoteSessionId,
        shipmentDetails: leadData.shipmentDetails,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to submit lead' }));
      throw new Error(error.message || 'Failed to submit lead');
    }

    return response.json();
  }

  /**
   * Generate a unique session ID for quote tracking
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
