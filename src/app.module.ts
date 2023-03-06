import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KakaoChatbotModule } from './domains/kakao-chatbot';

@Module({
  imports: [KakaoChatbotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
