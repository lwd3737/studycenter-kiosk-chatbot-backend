import { IMapper } from 'src/core';
import { ProfileDTO } from '../../dtos/template-output.interface';
import { Profile } from '../../domain/base/profile/profile.value-object';

export class ProfileMapper implements IMapper<Profile> {
  static toDTO(profile: Profile): ProfileDTO {
    const { nickname, imageUrl } = profile;

    return {
      nickname,
      imageUrl,
    };
  }
}
