import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { QuotesService, ShipmentInput, QuoteResult } from './quotes.service';
import { ThrottleGuard } from '@nestjs/throttler';

@Controller('quotes')
@UseGuards(ThrottleGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async getQuotes(@Body() shipmentInput: ShipmentInput): Promise<{ quoteId: string; results: QuoteResult[] }> {
    const results = await this.quotesService.getQuotes(shipmentInput);
    const quoteId = results.length > 0 ? results[0].id : `quote_${Date.now()}`;
    
    return {
      quoteId,
      results,
    };
  }

  @Get(':id')
  async getCachedQuote(@Param('id') quoteId: string): Promise<QuoteResult | null> {
    return this.quotesService.getCachedQuote(quoteId);
  }
}
