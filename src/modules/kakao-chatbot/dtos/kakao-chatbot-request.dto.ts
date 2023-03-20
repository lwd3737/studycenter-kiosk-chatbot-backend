import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsStringOrNumber } from 'src/shared/utils/validators';

export type ParamsDTO = Record<string, string>;

export type DetailParamsDTO = Record<string, DetailParamDTO>;

export class DetailParamDTO {
  @IsStringOrNumber()
  origin: string | number;

  @IsNotEmpty()
  value: any;

  @IsString()
  groupName: string;
}

export class BlockDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class UserPropertiesDTO {
  @IsString()
  plusfriendUserKey: string;

  @IsString()
  appUserId: string;

  @IsBoolean()
  isFriend: boolean;
}

export class UserDTO {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  properties: UserPropertiesDTO;
}

export class UserRequestDTO {
  @IsString()
  timezone: string;

  @ValidateNested()
  block: BlockDTO;

  @IsString()
  utterance: string;

  @IsString()
  lang: string;

  @ValidateNested()
  user: UserDTO;
}

export class BotDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class ActionDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsObject()
  params: ParamsDTO;

  @ValidateNested()
  detailParams: DetailParamsDTO;

  @IsObject()
  clientExtra: Record<string, any>;
}

export class KakaoChatbotRequestDTO {
  @ValidateNested()
  intent: BlockDTO;

  @ValidateNested()
  action: ActionDTO;

  @ValidateNested()
  userRequest: UserRequestDTO;

  @ValidateNested()
  bot: BotDTO;
}
