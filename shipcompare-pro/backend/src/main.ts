import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors();
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Health check endpoint
  app.getHttpAdapter().get('/api/health', (req: any, res: any) => {
    res.json({ status: 'ok', memory: process.memoryUsage().heapUsed / 1024 / 1024 + 'MB' });
  });

  // Root endpoint
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.json({ 
      message: 'ShipCompare API',
      version: '1.0.0',
      endpoints: {
        quotes: '/api/quotes',
        leads: '/api/leads',
        health: '/api/health',
      },
    });
  });

  // Set global prefix for all API endpoints
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
