import { SkillQuickReply } from './template-output.interface';

export class TicketTemplateDTOCreator {
  public static toTicketTypesQuickReplies(): SkillQuickReply[] {
    return [
      {
        label: '정기권',
        action: 'message',
        messageText: '정기권',
      },
      {
        label: '시간권',
        action: 'message',
        messageText: '시간권',
      },
      {
        label: '당일권',
        action: 'message',
        messageText: '당일권',
      },
    ];
  }
}
