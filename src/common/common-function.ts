import type { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { postMessage } from '@back/packages/slack-manager/messenger/messenger';
import type { IGetDatesRespose } from './common-interface';

export function logger(message?: any, ...optionalParams: any[]): void {
    const { log } = console;

    if (optionalParams.length > 0) {
      log(message, optionalParams);
    } else {
      log(message);
    }
}

export function getDates(): IGetDatesRespose {
  // Today's date
  const today: Date = new Date();
  const todayYear: number = today.getFullYear();
  const todayMonth: string = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay: string = String(today.getDate()).padStart(2, '0');
  const todayFormatted: string = `${todayYear}-${todayMonth}-${todayDay}`;

  // One month later
  const oneMonthLater: Date = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const laterYear: number = oneMonthLater.getFullYear();
  const laterMonth: string = String(oneMonthLater.getMonth() + 1).padStart(2, '0');
  const laterDay: string = String(oneMonthLater.getDate()).padStart(2, '0');
  const laterFormatted: string = `${laterYear}-${laterMonth}-${laterDay}`;

  return { todayFormatted, laterFormatted };
}

export async function postReportMessage(timeOffInfo: IGetTimeOffResponseBody): Promise<void> {
  const { startDate, endDate, note, timeOffPeriod, user, time, } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const attachments = [
    {
      fields: [
        {
          title: 'Name',
          value: user.name
        },
        {
          title: 'Start Date',
          value: startDate
        },
        {
          title: 'End Date',
          value: endDate
        },
        {
          title: 'Period',
          value: timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`
        },
      ],
      color: '#43c47e',
    }
  ];

  if (note) {
    attachments[0].fields.push({
      title: 'Note',
      value: note,
    });
  }
   await postMessage({
    channelID: process.env.REPORT_CHANNEL_ID ?? '',
    message: `I just got a new time off report by *${user.name}* for the *Team Status*. Check it out:`,
    attachments
  });
}

export function createSummary(status: string, name: string, timeOffPeriod: string | undefined, formatedTime: number) {
  return `${status === 'pending' ? '[pending]' : ''}${name} [${timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`}]`;
}
