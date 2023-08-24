import { IMapper } from 'src/core';
import { ProfileDTO } from '../../application/dtos/ITemplate-output';
import { Profile } from '../../domain/basic-template-outputs/profile/profile.value-object';

export class ProfileMapper implements IMapper<Profile> {
  static toDTO(profile: Profile): ProfileDTO {
    const { nickname, imageUrl } = profile;

    return {
      nickname,
      imageUrl,
    };
  }
}
