import {
  BasicCardDTO,
  CarouselDTO,
  CommerceCardDTO,
  ListCardDTO,
  SimpleImageDTO,
  SimpleTextDTO,
  SkillQuickReply,
  TextCardDTO,
} from './ITemplate-output';

export interface KakaoChatbotResponseDTO {
  version: '2.0';
  template: TemplateDTO;
  context?: ContextControlDTO;
  data?: Record<string, any>;
}

export interface TemplateDTO {
  outputs: SkillOutputDTO[];
  quickReplies?: SkillQuickReply[];
}

export type SkillOutputDTO =
  | { simpleText: SimpleTextDTO }
  | { simpleImage: SimpleImageDTO }
  | { basicCard: BasicCardDTO }
  | { textCard: TextCardDTO }
  | { commerceCard: CommerceCardDTO }
  | { listCard: ListCardDTO }
  | { carousel: CarouselDTO };

export interface ContextControlDTO {
  values: ContextValueDTO[];
}

export interface ContextValueDTO {
  name: string;
  lifeSpan: number;
  params?: Record<string, string>;
}
