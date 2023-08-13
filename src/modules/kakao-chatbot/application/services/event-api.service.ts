import { Injectable } from '@nestjs/common';
import { EventApiRepo } from 'src/modules/kakao-chatbot/infra/repos/event-api.repo';
import { EventApi } from '../../domain/event-api/event-api.vo';
import { EventApiResponse } from '../../domain/event-api/IEvent-api.repo';

@Injectable()
export class EventApiService {
  constructor(private readonly eventApiRepo: EventApiRepo) {}

  public async publish(eventApi: EventApi): Promise<EventApiResponse> {
    return await this.eventApiRepo.publish(eventApi);
  }
}
