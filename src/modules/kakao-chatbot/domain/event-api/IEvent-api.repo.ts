import { IRepo } from 'src/core/domain/repo.interface';
import { EventApi } from './event-api.vo';

export const EventApiRepoProvider = Symbol('EventApiRepo');

export type EventApiResponse = {
  taskId: string;
  status: 'SUCCESS' | 'FAIL' | 'ERROR';
  message: string;
  timestamp: number;
};

export interface IEventApiRepo extends IRepo<EventApi> {
  publish(eventApi: EventApi): Promise<EventApiResponse>;
}
