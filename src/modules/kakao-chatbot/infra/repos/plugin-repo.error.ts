import { RepoError } from 'src/core';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace PluginRepoErrors {
  export class ProfileFetchFailedError extends RepoError {
    constructor(message: string) {
      super(`Failed to fetch profile: ${message}`);
    }
  }
}
