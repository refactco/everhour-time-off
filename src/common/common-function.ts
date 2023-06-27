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

function getDayOrdinal(day: number): string {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

  const dateRange = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    const dayOrdinal = getDayOrdinal(currentDate.getDate());
    const formattedDateRange = `${formattedDate.split(' ')[0]} ${dayOrdinal}`;
    dateRange.push(formattedDateRange);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange.join(', ');
}

export async function postReportMessage(timeOffInfo: IGetTimeOffResponseBody): Promise<void> {
  const { startDate, endDate, timeOffPeriod, user, time } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const formatedDateRange = formatDateRange(startDate, endDate);

   await postMessage({
    channelID: process.env.REPORT_CHANNEL_ID ?? '',
    message: `🟡 *${user.name}* is Off on *${formatedDateRange} (${timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`})*`,
  });
}

export function createSummary(status: string, name: string, timeOffPeriod: string | undefined, formatedTime: number) {
  return `${status === 'pending' ? '[pending]' : ''}${name} [${timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`}]`;
}
