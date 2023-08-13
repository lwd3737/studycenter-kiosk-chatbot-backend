export interface EventApi {
  event: Event;
  user: User;
  params?: Record<string, any>;
  options?: Record<string, any>;
}
export interface Event {
  name: string;
  data?: Record<string, any>;
}
export interface User {
  type: 'appUserId' | 'plusfriendUserKey' | 'botUserKey';
  id: string;
  properties?: Record<string, any>;
}
