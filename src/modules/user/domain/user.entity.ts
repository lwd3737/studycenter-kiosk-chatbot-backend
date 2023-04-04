import { AggregateRoot } from 'src/core/domain';

export interface UserEntityProps {
  phoneNumber: string;
}

export class UserEntity extends AggregateRoot<UserEntityProps> {
  // private constructor(props: UserEntityProps, id?: string) {
  //   super(props, id);
  // }
  // static create(props: UserEntityProps, id?: string): UserEntity {
  //   return new UserEntity(props, id);
  // }
}
