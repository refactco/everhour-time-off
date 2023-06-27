import { MessageAttachment } from '@slack/types';

export interface IPostMessageParam {
  channelID: string;
  message: string;
  attachments: MessageAttachment[];
}
