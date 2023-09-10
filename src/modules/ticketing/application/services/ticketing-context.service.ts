import { Injectable } from '@nestjs/common';

type TicketingContext = {
  ticketId: string;
  seatId: string;
};

@Injectable()
export class TicketingContextService {
  private storage: Map<string, Partial<TicketingContext>> = new Map();

  public get(appUserId: string): Partial<TicketingContext> | null {
    return this.storage.get(appUserId) ?? null;
  }

  public save(appUserId: string, context: Partial<TicketingContext>): void {
    const existing = this.get(appUserId);
    this.storage.set(appUserId, { ...existing, ...context });
  }

  public clear(appUserId: string): void {
    this.storage.delete(appUserId);
  }
}
