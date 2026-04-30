import { Injectable } from '@nestjs/common';

@Injectable()
export class BulkService {
  async uploadFile(file: Express.Multer.File) {
    return { fileUrl: '', rowCount: 0, errorCount: 0 };
  }

  async validateFile(fileUrl: string) {
    return { validRows: [], invalidRows: [] };
  }

  async processBulkQuote(jobId: string) {
    return { jobId, status: 'processing' };
  }
}
