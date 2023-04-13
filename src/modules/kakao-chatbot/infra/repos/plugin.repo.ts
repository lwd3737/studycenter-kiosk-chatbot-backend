import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { RepoError } from 'src/core';
import { PluginRepoErrors } from './plugin-repo.error';

type GetProfileResponse = {
  nickname?: string;
  profile_image_url?: string;
  phone_number?: string;
  email?: string;
  app_user_id: string;
};

@Injectable()
export class PluginRepo {
  private readonly restApiKey: string;

  constructor() {
    const { KAKAO_REST_API_KEY } = process.env;
    if (!KAKAO_REST_API_KEY)
      throw new RepoError('KAKAO_REST_API_KEY is not defined.');

    this.restApiKey = KAKAO_REST_API_KEY;
  }

  async getProfile(otpUrl: string): Promise<GetProfileResponse> {
    const url = `${otpUrl}?rest_api_key=${this.restApiKey}`;

    try {
      const res = await axios.get<GetProfileResponse>(url);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      throw new PluginRepoErrors.ProfileFetchFailedError(
        `${axiosError.message}`,
      );
    }
  }
}
