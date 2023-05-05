import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ProfileDTO } from '../../dtos/template-output.interface';
import { Profile } from '../../domain/base/profile/profile.value-object';

@Injectable()
export class ProfileMapper implements IMapper<Profile> {
  toDTO(profile: Profile): ProfileDTO {
    const { nickname, imageUrl } = profile;

    return {
      nickname,
      imageUrl,
    };
  }
}
