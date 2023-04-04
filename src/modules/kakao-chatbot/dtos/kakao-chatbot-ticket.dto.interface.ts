export interface SimpleTextDTO {
  text: string;
}

export interface SimpleImageDTO {
  imageUrl: string;
  altText: string;
}

export interface BasicCardDTO {
  title?: string;
  description?: string;
  thumbnail: ThumbnailDTO;
  //profile?: IProfileDTO;
  //social?: ISocialDTO;
  buttons?: ButtonDTO[];
}

export interface CommerceCardDTO {
  description: string;
  price: number;
  currency: string;
  discount?: number;
  discountRate?: number;
  discountedPrice?: number;
  thumbnails: ThumbnailDTO[];
  profile?: ProfileDTO;
  buttons: ButtonDTO[];
}

export interface ListCardDTO {
  header: ListItemDTO;
  items: ListItemDTO[];
  buttons?: ButtonDTO[];
}

export interface ListItemDTO {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: LinkDTO;
  action?: 'block' | 'message';
  // action이 block일 때만 사용 가능
  blockId?: string;
  // action이 message일 때만 사용 가능
  messageText?: string;
  // action이 block or message 때만 사용 가능
  extra?: Record<string, any>;
}

export interface ItemCardDTO {
  thumbnail?: ThumbnailDTO;
  head?: ItemCardHead;
  profile?: ItemCardProfileDTO;
  imageTitle?: ItemCardImageTitleDTO;
  itemList: ItemCardItemListDTO[];
  itemListAlignment?: 'left' | 'right';
  itemListSummary?: ItemCardItemListSummaryDTO;
  title?: string;
  description?: string;
  buttons?: ButtonDTO[];
  buttonLayout?: 'vertical' | 'horizontal';
}

export type CarouselDTO = {
  type: 'basicCard' | 'commerceCard' | 'listCard' | 'itemCard';
  items: CarouselItemDTO[];
  header?: CarouselHeaderDTO;
};

export type CarouselItemDTO =
  | BasicCardDTO
  | CommerceCardDTO
  | ListCardDTO
  | ItemCardDTO;

export interface CarouselHeaderDTO {
  title: string;
  description: string;
  thumbnail: ThumbnailDTO;
}

export interface ThumbnailDTO {
  imageUrl: string;
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}

export interface ItemCardHead {
  title: string;
}

export interface ItemCardImageTitleDTO {
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface ItemCardItemListDTO {
  title: string;
  description: string;
}

export interface ItemCardItemListSummaryDTO {
  title: string;
  description: string;
}

export interface ButtonDTO {
  label: string;
  action: 'webLink' | 'message' | 'block' | 'phone' | 'share' | 'operator';
  webLinkUrl?: string;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?: Record<string, any>;
}

export interface ItemCardProfileDTO {
  imageUrl?: string;
  // width와 height 1:1 비율
  width?: number;
  height?: number;
  // 최대 15글자
  title: string;
}

export interface LinkDTO {
  pc?: string;
  mobile?: string;
  web?: string;
}

export interface ProfileDTO {
  nickname: string;
  imageUrl?: string;
}

export interface SkillQuickReply {
  label: string;
  action: 'message' | 'block';
  messageText?: string;
  blockId?: string;
  extra?: any;
}

//export interface ISocialDTO {}
