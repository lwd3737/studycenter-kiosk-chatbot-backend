export class RepoError extends Error {
  constructor(message: string) {
    super(`[RepoError] ${message}`);
  }
}
