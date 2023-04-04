import { ok, Result, ValueObject } from 'src/core';

export interface ProfileProps {
  nickname: string;
  imageUrl?: string;
}

export class Profile extends ValueObject<ProfileProps> {
  get nickname(): string {
    return this.props.nickname;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  public static create(props: ProfileProps): Result<Profile> {
    return ok(new Profile(props));
  }

  private constructor(props: ProfileProps) {
    super(props);
  }
}
