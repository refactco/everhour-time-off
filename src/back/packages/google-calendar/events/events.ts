/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { google, Auth, calendar_v3 } from 'googleapis';
import { createSummary, extractStatus, getDates, getOneEndDayLater, logger, postReportMessage } from '@common/common-function';
import { GaxiosResponse } from 'gaxios';
import type { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { OAuth2Client } from 'google-auth-library';
import { IShouldUpdatedEvents } from './events-interface';

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function listEvents(auth: Auth.OAuth2Client, calendarId: string):Promise<calendar_v3.Schema$Event[] | []> {
  const { todayFormatted, laterFormatted } = getDates();
  const calendar:calendar_v3.Calendar = google.calendar({ version: 'v3', auth });
  const res: GaxiosResponse<calendar_v3.Schema$Events> = await calendar.events.list({
    calendarId,
    timeMin: new Date(todayFormatted).toISOString(),
    timeMax: new Date(laterFormatted).toISOString(),
    timeZone: process.env.TIME_ZONE ?? 'America/Los_Angeles',
  });
  const events: calendar_v3.Schema$Event[] | undefined = res.data.items;
  if (!events || events.length === 0) {
    logger('No upcoming events found.');
  }

  return events ?? [];
}

export async function insertEvent(
  calendar:calendar_v3.Calendar,
  timeOffInfo:IGetTimeOffResponseBody,
  timeOffCalendarId: string
  ) {
  const { startDate, endDate, note, status, timeOffPeriod, user, time, approvedBy, days } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const summary: string = createSummary(status, user.name, timeOffPeriod, formatedTime);
  const oneDayEndLater : string = getOneEndDayLater(endDate);
  const event = {
    'summary': summary,
    // eslint-disable-next-line max-len
    'description': `Note: ${note}\n Status: ${status}\n ${approvedBy ? `approvedBy:${approvedBy?.name}` : ''}`,
    'start': {
      'date': startDate,
      'timeZone': process.env.TIME_ZONE ?? 'America/Los_Angeles',
    },
    'end': {
      'date': days > 1 ? oneDayEndLater.toString() : endDate,
      'timeZone': process.env.TIME_ZONE ?? 'America/Los_Angeles',
    },
  };
  try {
    await calendar.events.insert({
      calendarId: timeOffCalendarId,
      requestBody: event,
    });
  } catch (error) {
    logger(error);
  }
}
export async function updateEvent(
  calendar:calendar_v3.Calendar,
  timeOffInfo:IShouldUpdatedEvents,
  timeOffCalendarId: string
  ) {
  const { startDate, endDate, note, status, timeOffPeriod, user, time, eventId, approvedBy, days } = timeOffInfo;
  const formatedTime: number = time ? time / 3600 : 0;
  const summary: string = createSummary(status, user.name, timeOffPeriod, formatedTime);
  const oneDayEndLater : string = getOneEndDayLater(endDate);
  const event = {
    'summary': summary,
    // eslint-disable-next-line max-len
    'description': `Note: ${note}\n Status: ${status}\n ${approvedBy ? `approvedBy:${approvedBy?.name}` : ''}`,
    'start': {
      'date': startDate,
      'timeZone': process.env.TIME_ZONE ?? 'America/Los_Angeles',
    },
    'end': {
      'date': days > 1 ? oneDayEndLater.toString() : endDate,
      'timeZone': process.env.TIME_ZONE ?? 'America/Los_Angeles',
    },
  };
  try {
    await calendar.events.update({
      calendarId: timeOffCalendarId,
      eventId: eventId ?? '',
      requestBody: event,
    });
  } catch (error) {
    logger(error);
  }
}

export async function deleteEvent(calendar: calendar_v3.Calendar, eventId: string | null | undefined, timeOffCalendarId: string) {
  try {
    await calendar.events.delete({
      calendarId: timeOffCalendarId,
      eventId: eventId ?? '',
    });
  } catch (error) {
    logger(error);
  }
}

export async function handleEvent(
  auth: OAuth2Client,
  timeOffData:IGetTimeOffResponseBody[],
  timeOffCalendarId: string
  ):Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth });
  // eslint-disable-next-line no-restricted-syntax
  const existingEvents: calendar_v3.Schema$Event[] = await listEvents(auth, timeOffCalendarId);
  const shouldUpdateEvents:IShouldUpdatedEvents[] = [];
  const shouldSendReport : IGetTimeOffResponseBody[] = [];

  for (const timeOff of timeOffData) {
    const { startDate, endDate, timeOffPeriod, user, time, status, days } = timeOff;
    const formatedTime: number = time ? time / 3600 : 0;
    const summary: string = createSummary(status, user.name, timeOffPeriod, formatedTime);
    const oneDayEndLater : string = getOneEndDayLater(endDate);
    const comparedEndDate: string = days > 1 ? oneDayEndLater.toString() : endDate;
    // eslint-disable-next-line array-callback-return
    for (const event of existingEvents) {
      if (event.summary === summary
        && event?.start?.date === startDate
        && event?.end?.date === comparedEndDate
      ) {
        shouldUpdateEvents.push({ ...timeOff, eventId: event.id });
        const eventStatus: string = extractStatus(event?.description as string);
        if (status === 'approved' && eventStatus !== 'approved') {
          shouldSendReport.push(timeOff);
        }
      }
    }
  }

  // eslint-disable-next-line max-len
  const shouldDeleteEvents :calendar_v3.Schema$Event[] = existingEvents.filter((existEvent) => !shouldUpdateEvents.some((updateEventItem) => updateEventItem.eventId === existEvent.id));

  // eslint-disable-next-line max-len, arrow-body-style
  const shouldInsertedEvents: IGetTimeOffResponseBody[] = timeOffData.filter((timeOffItem) => {
    return !shouldUpdateEvents.some((timeOffUpdatedItem) => timeOffItem.user.name === timeOffUpdatedItem.user.name
      && timeOffItem.startDate === timeOffUpdatedItem.startDate
      && timeOffItem.endDate === timeOffUpdatedItem.endDate
      && timeOffItem.note === timeOffUpdatedItem.note
      && timeOffItem.timeOffType.name === timeOffUpdatedItem.timeOffType.name
      && timeOffItem.timeOffDurationType === timeOffUpdatedItem.timeOffDurationType);
  });

  for (const newEvent of shouldInsertedEvents) {
    if (process.env.ENABLE_SYNC_TIME_OFF_WITH_CALENDAR === 'true') {
      await insertEvent(calendar, newEvent, timeOffCalendarId);
    }
    if (newEvent.status === 'approved') {
      shouldSendReport.push(newEvent);
    }
  }

  if (process.env.ENABLE_SYNC_TIME_OFF_WITH_CALENDAR === 'true') {
    for (const existEvent of shouldUpdateEvents) {
      await updateEvent(calendar, existEvent, timeOffCalendarId);
    }

    for (const event of shouldDeleteEvents) {
      await deleteEvent(calendar, event?.id, timeOffCalendarId);
    }
  }

  if (process.env.ENABLE_SLACK_TIME_OFF_REPORT_CHANNLE === 'true') {
    for (const timeOffItem of shouldSendReport) {
      await postReportMessage(timeOffItem);
    }
  }
}
