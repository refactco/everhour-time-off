import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { getDailyTimeOff } from '@back/everhour/get-daily-time-off/get-daily-time-off-handler';
import { dailyReportHandler } from '@back/report/daily-report-handler/daily-report-handler';
import { logger } from '@common/common-function';

export const run = async () => {
  if (process.env.ENABLE_SLACK_TIME_OFF_REPORT_CHANNLE === 'true' && process.env.ENABLE_DAILY_TIME_OFF_REPORT === 'true') {
    try {
      const timeOffData:IGetTimeOffResponseBody[] = await getDailyTimeOff();
      await dailyReportHandler(timeOffData);
    } catch (error) {
      logger(error);
    }
  }
};
