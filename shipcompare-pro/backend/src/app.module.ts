import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { BulkModule } from './modules/bulk/bulk.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CarriersModule } from './modules/carriers/carriers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 3600,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    QuotesModule,
    ShipmentsModule,
    AddressesModule,
    BulkModule,
    AnalyticsModule,
    CarriersModule,
  ],
})
export class AppModule {}
