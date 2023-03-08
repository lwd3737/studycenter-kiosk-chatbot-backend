export interface IKakaoChatbotRequestDTO {
  intent: IBlockDTO;
  action: IActionDTO;
  userRequest: IUserRequestDTO;
  bot: IBotDTO;
}

export interface IActionDTO {
  id: string;
  name: string;
  params: IParamsDTO;
  detailParams: IDetailParamsDTO;
  clientExtra: Record<string, any> | null;
}

export interface IParamsDTO {
  [entity: string]: string;
}

export interface IDetailParamsDTO {
  [entity: string]: IDetailParamDTO;
}

export interface IDetailParamDTO {
  origin: string | number;
  value: any;
  groupName: string;
}

export interface IUserRequestDTO {
  timezone: string;
  block: IBlockDTO;
  utterance: string;
  lang: string;
  user: IUserDTO;
}

export interface IBlockDTO {
  id: string;
  name: string;
}

export interface IUserDTO {
  id: string;
  type: string;
  properties: IUserPropertiesDTO;
}

export interface IUserPropertiesDTO {
  plusfriendUserKey: string;
  appUserId: string;
  isFriend: boolean;
}

export interface IBotDTO {
  id: string;
  name: string;
}
