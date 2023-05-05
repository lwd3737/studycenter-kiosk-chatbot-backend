import { Injectable } from '@nestjs/common';
import { AppErrors, DomainError, IUseCase, Result, err, ok } from 'src/core';
import { Room } from 'src/modules/seat-management/domain/room/room.aggregate-root';
import { Seat } from 'src/modules/seat-management/domain/seat/seat.aggregate-root';
import { SeatPromptSimpleText } from '../../domain/seat-prompt-simple-text/seat-prompt-simple-text.value-object';
import { SimpleText } from '../../domain/base/simple-text/simple-text.value-object';

type UseCaseInput = {
  room: Room;
  availableSeats: Seat[];
};

type UseCaseResult = Result<
  SimpleText,
  AppErrors.UnexpectedError | DomainError
>;

@Injectable()
export class RenderSeatPromptSimpleTextUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  public execute(input: UseCaseInput): UseCaseResult {
    const simpleTextOrError = SeatPromptSimpleText.create({
      room: input.room,
      availableSeats: input.availableSeats,
    });
    if (simpleTextOrError.isErr()) return err(simpleTextOrError.error);

    return ok(simpleTextOrError.value);
  }
}
