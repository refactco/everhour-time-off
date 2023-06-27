import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { getTimeOffBot } from '@back/report/get-time-off-bot/get-time-off-bot-handler';
import { reportHandler } from '@back/report/report-handler/report-handler';
import { logger } from '@common/common-function';

export const run = async () => {
    try {
      const timeOffData:IGetTimeOffResponseBody[] = await getTimeOffBot();
      reportHandler(timeOffData);
    } catch (error) {
      logger(error);
    }
  };
