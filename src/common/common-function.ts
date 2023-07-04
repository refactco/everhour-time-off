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

export function getDailyDates(): IGetDatesRespose {
  // Today's date
  const today: Date = new Date();
  const todayYear: number = today.getFullYear();
  const todayMonth: string = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay: string = String(today.getDate()).padStart(2, '0');
  const todayFormatted: string = `${todayYear}-${todayMonth}-${todayDay}`;

  // One Days later
  const oneDayLater : Date = new Date();
  oneDayLater.setDate(today.getDate() + 1);
  const laterYear: number = oneDayLater.getFullYear();
  const laterMonth: string = String(oneDayLater.getMonth() + 1).padStart(2, '0');
  const laterDay: string = String(oneDayLater.getDate()).padStart(2, '0');
  const laterFormatted: string = `${laterYear}-${laterMonth}-${laterDay}`;

  return { todayFormatted, laterFormatted };
}
export function getWeeklyDates(): IGetDatesRespose {
  // Today's date
  const today: Date = new Date();
  const todayYear: number = today.getFullYear();
  const todayMonth: string = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay: string = String(today.getDate()).padStart(2, '0');
  const todayFormatted: string = `${todayYear}-${todayMonth}-${todayDay}`;

  // One week later
  const oneWeekLater: Date = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  const laterYear: number = oneWeekLater.getFullYear();
  const laterMonth: string = String(oneWeekLater.getMonth() + 1).padStart(2, '0');
  const laterDay: string = String(oneWeekLater.getDate()).padStart(2, '0');
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

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

  const dateRange = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (currentDate.toDateString() === today.toDateString()) {
      dateRange.push('Today');
    } else if (currentDate.toDateString() === tomorrow.toDateString()) {
      dateRange.push('Tomorrow');
    } else {
      const formattedDate = currentDate.toLocaleDateString('en-US', options);
      const dayOrdinal = getDayOrdinal(currentDate.getDate());
      const formattedDateRange = `${formattedDate.split(' ')[0]} ${dayOrdinal}`;
      dateRange.push(formattedDateRange);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange.join(', ');
}
export function createReportMessage(
  username: string,
  formatedDateRange: string,
  timeOffPeriod: string | undefined,
  formatedTime: number
): string {
  const formatedDateRangeArray = formatedDateRange.split(', ');
  let days: string = '';

  if (formatedDateRangeArray.length === 1 && formatedDateRangeArray[0] === 'Today') {
    days = ` ${formatedDateRangeArray[0]}`;
  } else if (formatedDateRangeArray.length === 1 && formatedDateRangeArray[0] === 'Tomorrow') {
    days = ` ${formatedDateRangeArray[0]}`;
  } else if (formatedDateRangeArray.length === 2 && formatedDateRangeArray[1] === 'Tomorrow') {
    days = ` ${formatedDateRangeArray[0]} and ${formatedDateRangeArray[1]}`;
  } else if (formatedDateRangeArray.length === 1 && formatedDateRangeArray[0] !== 'Today') {
    days = ` on ${formatedDateRangeArray.join(', ')}`;
  } else if (formatedDateRangeArray.length === 2 && formatedDateRangeArray[0] !== 'Tomorrow') {
    days = ` on ${formatedDateRangeArray.join(', ')}`;
  } else if (formatedDateRangeArray.length > 1 && formatedDateRangeArray[0] === 'Tomorrow') {
    days = `${formatedDateRangeArray[0]}, on ${formatedDateRangeArray.splice(1).join(', ')}`;
  } else if (formatedDateRangeArray.length > 2
    && formatedDateRangeArray[0] === 'Today'
    && formatedDateRangeArray[1] === 'Tomorrow'
    )
    {
    const lastDate: string[] = [...formatedDateRangeArray].splice(2);
    const formattedDates: string = lastDate.join(', ');
    days = ` ${formatedDateRangeArray[0]}, ${formatedDateRangeArray[1]}, on ${formattedDates})`;
  } else {
    days = ` on ${formatedDateRangeArray.join(', ')}`;
  }

  return `🟡 *${username}* is Off  *${days} (${timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`})*`;
}

export async function postReportMessage(timeOffInfo: IGetTimeOffResponseBody): Promise<void> {
  const { startDate, endDate, timeOffPeriod, user, time } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const formatedDateRange: string = formatDateRange(startDate, endDate);
  const reportMessage: string = createReportMessage(user.name, formatedDateRange, timeOffPeriod, formatedTime);

   await postMessage({
    channelID: process.env.REPORT_CHANNEL_ID ?? '',
    message: reportMessage,
  });
}

export function createSummary(status: string, name: string, timeOffPeriod: string | undefined, formatedTime: number) {
  return `${status === 'pending' ? '[pending]' : ''}${name} [${timeOffPeriod ?? `${formatedTime.toFixed(0)}h per day`}]`;
}

export function getOneEndDayLater(endDate: string): string {
const oneDayLaterdate: Date = new Date(endDate);
oneDayLaterdate.setDate(oneDayLaterdate.getDate() + 1);

// Format the date as YYYY-MM-DD
const year: number = oneDayLaterdate.getFullYear();
const month: string = String(oneDayLaterdate.getMonth() + 1).padStart(2, '0');
const day: string = String(oneDayLaterdate.getDate()).padStart(2, '0');

const newDate: string = `${year}-${month}-${day}`;

return newDate;
}

export function extractStatus(description: string) {
  const regex = /Status: (.+)/;
  const match = description.match(regex);
  let status: string = '';
  if (match && match.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    status = match[1];
  }
  return status;
}
