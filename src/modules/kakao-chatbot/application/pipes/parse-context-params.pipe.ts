import { PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

export class ParseContextParamsPipe
  implements PipeTransform<KakaoChatbotRequestDTO>
{
  constructor(private contextName: string) {}

  transform(value: KakaoChatbotRequestDTO): Record<string, any> | undefined {
    const context = value.contexts.find((c) => c.name === this.contextName);
    if (!context) throw new Error(`Context(${this.contextName}) not found`);
    if (!context.params) return;

    return Object.entries(context.params)
      .map(([key, value]) => ({ [key]: value.value }))
      .reduce((obj, param) => ({ ...obj, ...param }), {});
  }
}
