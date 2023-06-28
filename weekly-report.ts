import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { getWeeklyTimeOff } from '@back/everhour/get-weekly-time-off/get-weekly-time-off-handler';
import { weeklyReportHandler } from '@back/report/weekly-report-handler/weekly-report-handler';
import { logger } from '@common/common-function';

export const run = async () => {
    try {
      const timeOffData:IGetTimeOffResponseBody[] = await getWeeklyTimeOff();
      await weeklyReportHandler(timeOffData);
    } catch (error) {
      logger(error);
    }
};
