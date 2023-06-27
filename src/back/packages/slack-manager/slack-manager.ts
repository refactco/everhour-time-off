import { WebClient } from '@slack/web-api';

let slackClient: WebClient;

export function getSlackClient(): WebClient {
  if (!slackClient) {
    slackClient = new WebClient(process.env.SLACK_BOT_TOKEN ?? '');
  }

  return slackClient;
}
