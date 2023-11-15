export type ContextsDTO = {
  name: string;
  lifeSpan: number;
  ttl: number;
  params?: Record<
    string,
    {
      value: string;
      resolvedValue: string;
    }
  >;
}[];
