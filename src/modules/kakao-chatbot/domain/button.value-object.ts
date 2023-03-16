import { err, ok, Result, ValueObject } from 'src/core';
import { ButtonError, ButtonErrors } from './errors/button.error';
export interface ButtonProps {
  label: string;
  action: ButtonActionEnum;
  webLinkUrl?: string;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?: Record<string, any>;
}

export enum ButtonActionEnum {
  WEB_LINK = 'webLink',
  MESSAGE = 'message',
  BLOCK = 'block',
  PHONE = 'phone',
}

export class Button extends ValueObject<ButtonProps> {
  private static LABEL_MAX_LENGTH = 14;

  get label(): string {
    return this.props.label;
  }

  get action(): ButtonActionEnum {
    return this.props.action;
  }

  get webLinkUrl(): string | undefined {
    return this.props.webLinkUrl;
  }

  get messageText(): string | undefined {
    return this.props.messageText;
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  get blockId(): string | undefined {
    return this.props.blockId;
  }

  get extra(): Record<string, any> | undefined {
    return this.props.extra;
  }

  protected constructor(props: ButtonProps) {
    super(props);
  }

  public static create(props: ButtonProps): Result<Button, ButtonError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new Button(props));
  }

  protected static validate(props: ButtonProps): Result<null, ButtonError> {
    if (!this.isLabelLengthInvalid(props.label)) {
      return err(new ButtonErrors.LabelLengthInvalidError(props.label));
    }

    if (!this.isPropsMismatchingActionIncluded(props)) {
      return err(
        new ButtonErrors.PropsMismatchingActionIncludedError(props.action),
      );
    }

    return ok(null);
  }

  private static isLabelLengthInvalid(label: string): boolean {
    return label.length > 0 && label.length <= this.LABEL_MAX_LENGTH;
  }

  private static isPropsMismatchingActionIncluded(props: ButtonProps): boolean {
    const { action, webLinkUrl, messageText, phoneNumber, blockId } = props;

    const isWebLinkIncluded = !!webLinkUrl;
    const isMessageTextIncluded = !!messageText;
    const isPhoneNumberIncluded = !!phoneNumber;
    const isBlockIdIncluded = !!blockId;

    switch (action) {
      case ButtonActionEnum.BLOCK: {
        if (isWebLinkIncluded) return false;
        if (isPhoneNumberIncluded) return false;
        if (!isMessageTextIncluded) return false;
        if (!isBlockIdIncluded) return false;

        return true;
      }
      case ButtonActionEnum.MESSAGE: {
        if (isWebLinkIncluded) return false;
        if (isPhoneNumberIncluded) return false;
        if (isBlockIdIncluded) return false;
        if (!isMessageTextIncluded) return false;

        return true;
      }
      case ButtonActionEnum.PHONE: {
        if (isWebLinkIncluded) return false;
        if (isBlockIdIncluded) return false;
        if (isMessageTextIncluded) return false;
        if (!isPhoneNumberIncluded) return false;

        return true;
      }

      case ButtonActionEnum.WEB_LINK: {
        if (isPhoneNumberIncluded) return false;
        if (isBlockIdIncluded) return false;
        if (isMessageTextIncluded) return false;
        if (!isWebLinkIncluded) return false;

        return true;
      }
    }
  }
}
