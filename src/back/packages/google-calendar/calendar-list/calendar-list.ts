/* eslint-disable camelcase */
import { google, Auth, calendar_v3 } from 'googleapis';

export async function getTimeOffCalendarId(auth: Auth.OAuth2Client): Promise<string | null | undefined>
{
    const calendar: calendar_v3.Calendar = google.calendar({ version: 'v3', auth });
    const { data } = await calendar.calendarList.list();

    const calendars: calendar_v3.Schema$CalendarListEntry[] | undefined = data.items;
    if (calendars) {
        // eslint-disable-next-line no-restricted-syntax
        for (const calendarInfo of calendars) {
            const { id, summary } = calendarInfo;
            if (summary === 'Time Off') {
                return id;
            }
        }
    }
    return null;
  }
