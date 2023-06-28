import { getWeeklyDates, logger } from '@common/common-function';
import axios, { AxiosResponse } from 'axios';
import type { IGetTimeOffRequestBody, IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';

export async function getWeeklyTimeOff(): Promise<IGetTimeOffResponseBody[] | []> {
  const { todayFormatted, laterFormatted } = getWeeklyDates();
  try {
    const { data, status } = await axios
        .get<IGetTimeOffResponseBody[], AxiosResponse<IGetTimeOffResponseBody[]>, IGetTimeOffRequestBody>(
          `${process.env.EVER_HOUR_API ?? ''}/resource-planner/assignments`,
          {
            params: {
              from: todayFormatted,
              to: laterFormatted,
              type: 'time-off'
            },
            headers: {
              'X-Api-Key': process.env.EVER_HOUR_TOKEN ?? '',
            },
          },
        );

      if (status === 200) {
        return data;
      }
  } catch (error) {
    logger(error);
  }

  return [];
}
