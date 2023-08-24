import { ContextControlDTO } from '../../application/dtos/IResponse.dto';
import { ContextControl } from '../../domain/basic-template-outputs/context-control/context-control.value-object';

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
