import { Injectable, Logger } from '@nestjs/common';
import { ICarrierAdapter } from './interfaces/carrier-adapter.interface';
import { ShipmentInput } from '../quotes/dto/shipment-input.dto';
import { QuoteResult } from '../quotes/dto/quote-result.dto';

/**
 * Service that orchestrates carrier API calls.
 * Manages multiple carrier adapters and aggregates results.
 */
@Injectable()
export class CarriersService {
  private readonly logger = new Logger(CarriersService.name);
  private readonly carriers: Map<string, ICarrierAdapter> = new Map();

  constructor(
    private readonly fedexAdapter: ICarrierAdapter,
    private readonly upsAdapter: ICarrierAdapter,
    private readonly dhlAdapter: ICarrierAdapter,
    private readonly uspsAdapter: ICarrierAdapter,
    private readonly consolidatedAdapter: ICarrierAdapter,
  ) {
    // Register available carriers
    this.registerCarrier(fedexAdapter);
    this.registerCarrier(upsAdapter);
    this.registerCarrier(dhlAdapter);
    this.registerCarrier(uspsAdapter);
    this.registerCarrier(consolidatedAdapter);
  }

  /**
   * Register a carrier adapter.
   */
  private registerCarrier(adapter: ICarrierAdapter): void {
    this.carriers.set(adapter.carrierId, adapter);
    this.logger.log(`Registered carrier: ${adapter.carrierName} (${adapter.carrierId})`);
  }

  /**
   * Get rates from all registered carriers in parallel.
   * Uses Promise.allSettled to handle partial failures gracefully.
   */
  async getRatesFromAllCarriers(shipment: ShipmentInput): Promise<{
    results: QuoteResult[];
    errors: Array<{ carrierId: string; error: string }>;
  }> {
    const results: QuoteResult[] = [];
    const errors: Array<{ carrierId: string; error: string }> = [];

    const carrierPromises = Array.from(this.carriers.values()).map(async (adapter) => {
      try {
        const rates = await adapter.getRates(shipment);
        return { success: true as const, rates, carrierId: adapter.carrierId };
      } catch (error) {
        return {
          success: false as const,
          error: error instanceof Error ? error.message : 'Unknown error',
          carrierId: adapter.carrierId,
        };
      }
    });

    const settledResults = await Promise.allSettled(carrierPromises);

    for (const result of settledResults) {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          results.push(...result.value.rates);
        } else {
          errors.push({
            carrierId: result.value.carrierId,
            error: result.value.error,
          });
        }
      } else {
        // Promise rejected
        errors.push({
          carrierId: 'unknown',
          error: result.reason instanceof Error ? result.reason.message : 'Promise rejected',
        });
      }
    }

    this.logger.log(`Retrieved ${results.length} rates from ${this.carriers.size} carriers`);
    if (errors.length > 0) {
      this.logger.warn(`Errors from ${errors.length} carriers: ${JSON.stringify(errors)}`);
    }

    return { results, errors };
  }

  /**
   * Get a specific carrier adapter by ID.
   */
  getCarrier(carrierId: string): ICarrierAdapter | undefined {
    return this.carriers.get(carrierId);
  }

  /**
   * Get all registered carrier IDs.
   */
  getRegisteredCarriers(): string[] {
    return Array.from(this.carriers.keys());
  }
}
