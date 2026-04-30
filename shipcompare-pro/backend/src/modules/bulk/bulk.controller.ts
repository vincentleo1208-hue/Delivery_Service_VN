import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BulkService } from './bulk.service';

@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.bulkService.uploadFile(file);
  }

  @Post('validate')
  async validate(@Body() body: { fileUrl: string }) {
    return this.bulkService.validateFile(body.fileUrl);
  }

  @Post('quote')
  async processQuote(@Body() body: { jobId: string }) {
    return this.bulkService.processBulkQuote(body.jobId);
  }
}
