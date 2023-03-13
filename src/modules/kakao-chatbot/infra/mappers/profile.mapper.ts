import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Profile } from '../../domain';
import { IProfileDTO } from '../../dtos';

@Injectable()
export class ProfileMapper implements IMapper<Profile> {
  toDTO(profile: Profile): IProfileDTO {
    const { nickname, imageUrl } = profile;

    return {
      nickname,
      imageUrl,
    };
  }
}
