import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { CarriersModule } from './carriers/carriers.module';
import { QuotesModule } from './quotes/quotes.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { LabelsModule } from './labels/labels.module';
import { BulkModule } from './bulk/bulk.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { PricingModule } from './pricing/pricing.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 3600000, // 1 hour
        limit: 100, // 100 requests per hour for guests
      },
    ]),

    // Scheduled jobs
    ScheduleModule.forRoot(),

    // Feature modules
    CarriersModule,
    QuotesModule,
    UsersModule,
    AddressesModule,
    ShipmentsModule,
    LabelsModule,
    BulkModule,
    AnalyticsModule,
    AuthModule,
    PricingModule,
    AdminModule,
  ],
})
export class AppModule {}
