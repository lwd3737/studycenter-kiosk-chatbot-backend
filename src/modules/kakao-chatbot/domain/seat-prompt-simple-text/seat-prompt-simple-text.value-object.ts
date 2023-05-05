import { DomainError, Result, ValueObject } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { SimpleText } from '../base/simple-text/simple-text.value-object';

interface Props {
  room: Room;
  availableSeats: Seat[];
}

export class SeatPromptSimpleText extends ValueObject<Props> {
  public static create(props: Props): Result<SimpleText, DomainError> {
    return SimpleText.create({
      text: this.createPromptText(props),
    });
  }

  private static createPromptText(props: Props): string {
    return `[${props.room.title}에서 이용가능한 좌석번호]\n:${this.formatSeats(
      props.availableSeats,
    )}\n\n원하시는 좌석번호를\n'/s [좌석번호]' 또는 '/좌석 [좌석번호]'\n형식으로 채팅창에 입력해주세요.\n
      \n예시) 좌석번호가 3번 이라면,\n/s 3 또는 /좌석 3
    `;
  }

  private static formatSeats(seats: Seat[]): string {
    return seats.map((seat) => seat.number.value).join(', ');
  }

  private constructor(props: Props) {
    super(props);
  }
}
