import { ContextControlDTO } from '../../dtos/response.dto.interface';
import { ContextControl } from '../../domain/base/context-control/context-control.value-object';

export class ContextControlMapper {
  static toDTO(contextControl: ContextControl): ContextControlDTO {
    return {
      values: contextControl.values.map((value) => ({
        name: value.name,
        lifeSpan: value.lifeSpan,
        params: value.params,
      })),
    };
  }
}
