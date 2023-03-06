import {
  IBasicCardDTO,
  ICarouselDTO,
  ICommerceCardDTO,
  IListCardDTO,
  ISimpleImageDTO,
  ISimpleTextDTO,
  ISkillQuickReply,
} from './kakao-chatbot-ticket.dto.interface';

export interface IKakaoChatbotResponseDTO {
  version: '2.0';
  template: ITemplateDTO;
  context?: IContextControlDTO;
  data?: Record<string, any>;
}

export interface ITemplateDTO {
  outputs: ISkillOutputDTO[];
  quickReplies?: ISkillQuickReply[];
}

export type ISkillOutputDTO =
  | { simpleText: ISimpleTextDTO }
  | { simpleImage: ISimpleImageDTO }
  | { basicCard: IBasicCardDTO }
  | { commerceCard: ICommerceCardDTO }
  | { listCard: IListCardDTO }
  | { carousel: ICarouselDTO };

export interface IContextControlDTO {
  values: IContextValueDTO[];
}

export interface IContextValueDTO {
  name: string;
  lifeSpan: number;
  params?: Record<string, string>;
}
