import { Injectable } from '@nestjs/common';
import { EventApi } from '../../domain/event-api/event-api.vo';
import axios, { AxiosError } from 'axios';
import {
  EventApiResponse,
  IEventApiRepo,
} from '../../domain/event-api/IEvent-api.repo';
import { RepoError } from 'src/core';

@Injectable()
export class EventApiRepo implements IEventApiRepo {
  private config: {
    restApiKey: string;
    botId: string;
    url: string;
  };

  constructor() {
    const { KAKAO_REST_API_KEY, BOT_ID, EVENT_API_URL } = process.env;
    if (!KAKAO_REST_API_KEY)
      throw new Error('KAKAO_REST_API_KEY is not defined.');
    if (!BOT_ID) throw new Error('BOT_ID is not defined.');
    if (!EVENT_API_URL) throw new Error('EVENT_API_URL is not defined.');

    this.config = {
      botId: BOT_ID,
      url: EVENT_API_URL.replace('{botId}', BOT_ID),
      restApiKey: KAKAO_REST_API_KEY,
    };
  }

  public async publish(eventApi: EventApi): Promise<EventApiResponse> {
    try {
      const res = await axios.post<EventApiResponse>(
        this.config.url,
        {
          event: {
            name: eventApi.event.name,
            data: eventApi.event.data,
          },
          user: [
            {
              type: eventApi.user.type,
              id: eventApi.user.id,
            },
          ],
        },
        {
          headers: {
            Authorization: `KakaoAK ${this.config.restApiKey}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      throw new RepoError(axiosError.response?.data?.message);
    }
  }
}
