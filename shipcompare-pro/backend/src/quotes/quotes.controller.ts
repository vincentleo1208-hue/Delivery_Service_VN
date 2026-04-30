import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { ShipmentInput } from './dto/shipment-input.dto';
import { QuoteResult } from './dto/quote-result.dto';

@Controller('quotes')
export class QuotesController {
  private readonly logger = new Logger(QuotesController.name);

  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async getQuotes(@Body() shipment: ShipmentInput): Promise<{
    quotes: QuoteResult[];
    expiresAt: Date;
    quoteSessionId: string;
  }> {
    this.logger.log(`Received quote request for shipment from ${shipment.origin.zip} to ${shipment.destination.zip}`);
    return await this.quotesService.getQuotes(shipment);
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string): Promise<{
    quotes: QuoteResult[];
    expiresAt: Date;
    quoteSessionId: string;
  } | null> {
    // TODO: Implement quote retrieval from cache/database
    this.logger.log(`Retrieving quote by ID: ${id}`);
    return null; // Placeholder
  }
}
