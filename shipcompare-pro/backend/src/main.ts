import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  app.getHttpAdapter().get('/api/health', (req: any, res: any) => {
    res.json({ status: 'ok', memory: process.memoryUsage().heapUsed / 1024 / 1024 + 'MB' });
  });
  
  app.getHttpAdapter().get('/', (req: any, res: any) => {
    res.sendFile('index.html', { root: 'dist/public' });
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
