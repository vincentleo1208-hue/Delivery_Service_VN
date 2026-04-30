import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { LabelsService } from './labels.service';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  async purchaseLabel(@Body() body: { carrier: string; quoteId: string; userId: string }) {
    return this.labelsService.purchaseLabel(body.carrier, body.quoteId, body.userId);
  }

  @Get(':id/download')
  async downloadLabel(@Param('id') labelId: string) {
    const url = await this.labelsService.downloadLabel(labelId);
    return { downloadUrl: url };
  }
}
