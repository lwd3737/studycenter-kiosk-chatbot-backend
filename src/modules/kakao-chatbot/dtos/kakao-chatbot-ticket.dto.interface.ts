export interface ISimpleTextDTO {
  text: string;
}

export interface ISimpleImageDTO {
  imageUrl: string;
  altText: string;
}

export interface IBasicCardDTO {
  title?: string;
  description?: string;
  thumbnail: IThumbnailDTO;
  //profile?: IProfileDTO;
  //social?: ISocialDTO;
  buttons?: IButtonDTO[];
}

export interface ICommerceCardDTO {
  description: string;
  price: number;
  currency: string;
  discount?: number;
  discountRate?: number;
  discountedPrice?: number;
  thumbnails: IThumbnailDTO[];
  profile?: IProfileDTO;
  buttons: IButtonDTO[];
}

export interface IListCardDTO {
  header: IListItemDTO;
  items: IListItemDTO[];
  buttons?: IButtonDTO[];
}

export interface IListItemDTO {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: ILinkDTO;
  action?: 'block' | 'message';
  // action이 block일 때만 사용 가능
  blockId?: string;
  // action이 message일 때만 사용 가능
  messageText?: string;
  // action이 block or message 때만 사용 가능
  extra?: Record<string, any>;
}

export interface IItemCardDTO {
  thumbnail?: IThumbnailDTO;
  // head와 profile 동시에 사용 x
  // 케로셀형에서 head와 profile 섞어서 사용 x
  head?: IItemCardHead;
  profile?: IItemCardProfileDTO;
  imageTitle?: IItemCardImageTitleDTO;
  itemList: IItemCardItemListDTO[];
  itemListAlignment?: 'left' | 'right';
  itemListSummary?: IItemCardItemListSummaryDTO;
  title?: string;
  description?: string;
  buttons?: IButtonDTO[];
  buttonLayout?: 'vertical' | 'horizontal';
}

export type ICarouselDTO = {
  type: 'basicCard' | 'commerceCard' | 'listCard' | 'itemCard';
  items: ICarouselItemDTO[];
  header?: ICarouselHeaderDTO;
};

export type ICarouselItemDTO =
  | IBasicCardDTO
  | ICommerceCardDTO
  | IListCardDTO
  | IItemCardDTO;

export interface ICarouselHeaderDTO {
  title: string;
  description: string;
  thumbnail: IThumbnailDTO;
}

export interface IThumbnailDTO {
  imageUrl: string;
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}

export interface IItemCardHead {
  title: string;
}

export interface IItemCardImageTitleDTO {
  title: string;
  description?: string;
  imageUrl?: string;
}

export interface IItemCardItemListDTO {
  title: string;
  description: string;
}

export interface IItemCardItemListSummaryDTO {
  title: string;
  description: string;
}

export interface IButtonDTO {
  label: string;
  action: 'webLink' | 'message' | 'block' | 'phone' | 'share' | 'operator';
  webLinkUrl?: string;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?: Record<string, any>;
}

export interface IItemCardProfileDTO {
  imageUrl?: string;
  // width와 height 1:1 비율
  width?: number;
  height?: number;
  // 최대 15글자
  title: string;
}

export interface ILinkDTO {
  pc?: string;
  mobile?: string;
  web?: string;
}

export interface IProfileDTO {
  nickname: string;
  imageUrl?: string;
}

export interface ISkillQuickReply {
  label: string;
  action: 'message' | 'block';
  messageText?: string;
  blockId?: string;
  extra?: any;
}

//export interface ISocialDTO {}
