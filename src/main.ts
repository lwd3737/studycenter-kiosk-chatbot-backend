import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api', { exclude: ['payment'] });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     enableDebugMessages: true,
  //     whitelist: true,
  //     validationError: {
  //       target: true,
  //       value: true,
  //     },
  //     //forbidNonWhitelisted: true,
  //     // forbidUnknownValues: true,
  //   }),
  // );

  await app.listen(8000);
}
bootstrap();
