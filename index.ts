import { authorize } from '@packages/google-calendar/calendar-authentication/calendar-authentication';
import { getTimeOffCalendarId } from '@packages/google-calendar/calendar-list/calendar-list';
import type { OAuth2Client } from 'google-auth-library';
import { handleEvent } from '@packages/google-calendar/events/events';
import { logger } from '@common/common-function';
import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { getTimeOff } from '@back/everhour/get-timeoff/get-time-off-handler';

export const run = async () => {
  try {
    const auth: OAuth2Client = await authorize();
    const timeOffCalendarId:string | null | undefined = await getTimeOffCalendarId(auth);
    if (timeOffCalendarId) {
        const timeOffData:IGetTimeOffResponseBody[] = await getTimeOff();
        await handleEvent(auth, timeOffData, timeOffCalendarId);
    }
  } catch (error) {
    logger(error);
  }
};
