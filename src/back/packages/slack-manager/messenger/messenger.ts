import type { ChatPostMessageResponse } from '@slack/web-api';
import { getSlackClient } from '../slack-manager';
import type { IPostMessageParam } from './messenger-interface';

export async function postMessage({
    channelID,
    message,
}: IPostMessageParam): Promise<ChatPostMessageResponse> {
    const slackClient = getSlackClient();
    const postMessageResponse: ChatPostMessageResponse = await slackClient.chat.postMessage({
      channel: channelID,
      text: message,
    });
    return postMessageResponse;
}
