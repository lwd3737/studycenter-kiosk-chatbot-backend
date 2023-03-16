export class MapperError extends Error {
  constructor(message: string) {
    super(`[Mapper Error]${message}`);
  }
}
