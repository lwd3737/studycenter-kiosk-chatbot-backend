import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KakaoChatbotModule } from './modules/kakao-chatbot';
import { AuthModule } from './modules/auth';
import { SeederModule } from './modules/seeder/seeder.module';
import { CustomConfigModule } from './modules/config';

@Module({
  imports: [
    CustomConfigModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),

    SeederModule,
    AuthModule,
    KakaoChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
