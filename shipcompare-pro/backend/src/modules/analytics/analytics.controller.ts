import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('spending')
  async getSpending(@Query('userId') userId: string, @Query() dateRange: any) {
    return this.analyticsService.getSpendingByCarrier(userId, dateRange);
  }

  @Get('average-cost')
  async getAverageCost(@Query('userId') userId: string, @Query() dateRange: any) {
    return this.analyticsService.getAverageCostOverTime(userId, dateRange);
  }

  @Get('routes')
  async getRoutes(@Query('userId') userId: string) {
    return this.analyticsService.getMostUsedRoutes(userId);
  }

  @Get('savings')
  async getSavings(@Query('userId') userId: string, @Query() dateRange: any) {
    return this.analyticsService.getSavingsAnalysis(userId, dateRange);
  }
}
