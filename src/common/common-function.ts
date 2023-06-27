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

export function getBotDates(): IGetDatesRespose {
  // Today's date
  const today: Date = new Date();
  const todayYear: number = today.getFullYear();
  const todayMonth: string = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay: string = String(today.getDate()).padStart(2, '0');
  const todayFormatted: string = `${todayYear}-${todayMonth}-${todayDay}`;

  // Two Days later
  const twoDaysLater : Date = new Date();
  twoDaysLater.setDate(today.getDate() + 2);
  const laterYear: number = twoDaysLater.getFullYear();
  const laterMonth: string = String(twoDaysLater.getMonth() + 1).padStart(2, '0');
  const laterDay: string = String(twoDaysLater.getDate()).padStart(2, '0');
  const laterFormatted: string = `${laterYear}-${laterMonth}-${laterDay}`;

  return { todayFormatted, laterFormatted };
}

export function formatDateRange(startDate: string, endDate: string): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  if (start.toDateString() === today.toDateString() && end.toDateString() === today.toDateString()) {
    return 'Today';
  } if (start.toDateString() === tomorrow.toDateString() && end.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } if (start.toDateString() === today.toDateString() && end.toDateString() === tomorrow.toDateString()) {
    return 'Today, Tomorrow';
  }
    const options: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit' };

    const dateRange = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      dateRange.push(currentDate.toLocaleString('en-US', options));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange.join(', ');
}

export async function postReportMessage(timeOffInfo: IGetTimeOffResponseBody): Promise<void> {
  const { startDate, endDate, note, timeOffPeriod, user, time } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const formatedDateRange = formatDateRange(startDate, endDate);
  const attachments = [
    {
      fields: [
        {
          title: 'Name',
          value: user.name
        },
        {
          title: 'Date',
          value: formatedDateRange
        },
        {
          title: 'Time Off Period',
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
