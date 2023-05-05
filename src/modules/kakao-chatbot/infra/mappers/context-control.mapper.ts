import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ContextControlDTO } from '../../dtos/response.dto.interface';
import { ContextControl } from '../../domain/base/context-control/context-control.value-object';

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
