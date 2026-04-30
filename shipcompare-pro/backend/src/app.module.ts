import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Feature Modules
import { QuotesModule } from './quotes/quotes.module';
import { CarriersModule } from './carriers/carriers.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { LabelsModule } from './labels/labels.module';
import { BulkModule } from './bulk/bulk.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database - will be configured with actual connection in .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'shipcompare_pro',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    
    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 3600000, // 1 hour
        limit: 100, // 100 requests per hour for guests
      },
    ]),
    
    // Scheduled Jobs
    ScheduleModule.forRoot(),
    
    // Feature Modules
    QuotesModule,
    CarriersModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    ShipmentsModule,
    LabelsModule,
    BulkModule,
    JobsModule,
  ],
})
export class AppModule {}
