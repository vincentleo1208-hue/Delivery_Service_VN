import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { ShipmentInput, QuoteResult } from '../../common/types';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async getRates(@Body() input: ShipmentInput): Promise<QuoteResult[]> {
    return this.quotesService.getRates(input);
  }

  @Get(':id')
  async getCachedQuote(@Param('id') quoteId: string): Promise<QuoteResult[]> {
    const result = await this.quotesService.getCachedQuote(quoteId);
    return result || [];
  }
}
