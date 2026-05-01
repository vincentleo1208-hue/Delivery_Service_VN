import { Injectable, Logger } from '@nestjs/common';
import { CarriersService } from '../carriers/carriers.service';
import { ShipmentInput } from './dto/shipment-input.dto';
import { QuoteResult } from './dto/quote-result.dto';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  // Open Router discount percentage (e.g., 5% off the lowest rate)
  private readonly OPEN_ROUTER_DISCOUNT = 0.05;

  constructor(private readonly carriersService: CarriersService) {}

  /**
   * Get quotes from all carriers for a given shipment.
   * Results are sorted by total cost (ascending) by default.
   */
  async getQuotes(shipment: ShipmentInput): Promise<{
    quotes: QuoteResult[];
    expiresAt: Date;
    quoteSessionId: string;
    openRouterRate?: QuoteResult;
  }> {
    const { results, errors } = await this.carriersService.getRatesFromAllCarriers(shipment);

    // Sort by total cost (ascending)
    const sortedQuotes = results.sort((a, b) => a.totalCost - b.totalCost);

    // Mark cheapest and fastest options
    if (sortedQuotes.length > 0) {
      sortedQuotes[0].isCheapest = true;
      
      // Find fastest (shortest transit days)
      const fastest = sortedQuotes.reduce((min, q) => 
        q.transitDays < min.transitDays ? q : min
      );
      fastest.isFastest = true;
    }

    // Calculate Open Router Rate (always lower or equal to the lowest price)
    let openRouterRate: QuoteResult | undefined;
    if (sortedQuotes.length > 0) {
      const lowestQuote = sortedQuotes[0];
      const discountedPrice = lowestQuote.totalCost * (1 - this.OPEN_ROUTER_DISCOUNT);
      
      openRouterRate = {
        id: `open_router_${Date.now()}`,
        carrierId: 'open_router',
        carrierName: 'Open Router (Best Rate)',
        serviceName: 'Open Router Consolidated',
        serviceCode: 'OR-BEST',
        baseRate: Math.round(discountedPrice * 100) / 100,
        surcharges: [],
        totalCost: Math.round(discountedPrice * 100) / 100,
        currency: lowestQuote.currency,
        estimatedDeliveryDate: lowestQuote.estimatedDeliveryDate,
        transitDays: lowestQuote.transitDays,
        reliabilityScore: 95,
        isCheapest: false,
        isFastest: false,
      };
    }

    const quoteSessionId = `qs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.logger.log(`Generated ${sortedQuotes.length} quotes, session: ${quoteSessionId}`);

    return {
      quotes: sortedQuotes,
      expiresAt,
      quoteSessionId,
      openRouterRate,
    };
  }
}
