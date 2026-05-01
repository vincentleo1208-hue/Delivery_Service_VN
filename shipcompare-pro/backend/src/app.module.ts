import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { LeadsModule } from './leads/leads.module';

// Entities
import { User } from './users/user.entity';
import { Lead } from './leads/lead.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'shipcompare',
      entities: [User, Lead],
      synchronize: process.env.NODE_ENV !== 'production',
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
    LeadsModule,
  ],
})
export class AppModule {}
