import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Profile } from '../../domain/profile.value-object';
import { ProfileDTO } from '../../dtos/kakao-chatbot-ticket.dto.interface';

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
