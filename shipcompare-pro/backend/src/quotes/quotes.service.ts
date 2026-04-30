import { Injectable, Logger } from '@nestjs/common';
import { CarriersService } from '../carriers/carriers.service';
import { ShipmentInput } from './dto/shipment-input.dto';
import { QuoteResult } from './dto/quote-result.dto';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(private readonly carriersService: CarriersService) {}

  /**
   * Get quotes from all carriers for a given shipment.
   * Results are sorted by total cost (ascending) by default.
   */
  async getQuotes(shipment: ShipmentInput): Promise<{
    quotes: QuoteResult[];
    expiresAt: Date;
    quoteSessionId: string;
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

    const quoteSessionId = `qs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.logger.log(`Generated ${sortedQuotes.length} quotes, session: ${quoteSessionId}`);

    return {
      quotes: sortedQuotes,
      expiresAt,
      quoteSessionId,
    };
  }
}
