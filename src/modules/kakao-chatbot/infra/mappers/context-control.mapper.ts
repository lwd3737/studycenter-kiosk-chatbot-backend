import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ContextControl } from '../../domain/context-control/context-control.value-object';
import { ContextControlDTO } from '../../dtos/response.dto.interface';

@Injectable()
export class ContextControlMapper implements IMapper<ContextControl> {
  toDTO(contextControl: ContextControl): ContextControlDTO {
    return {
      values: contextControl.values.map((value) => ({
        name: value.name,
        lifeSpan: value.lifeSpan,
        params: value.params,
      })),
    };
  }
}
