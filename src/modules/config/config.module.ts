import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { CustomConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['development.env', 'production.env'],
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
