import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { postReportMessage } from '@common/common-function';

export async function dailyReportHandler(timeOffData:IGetTimeOffResponseBody[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const timeOffItem of timeOffData) {
        if (timeOffItem.status === 'approved') {
            // eslint-disable-next-line no-await-in-loop
            await postReportMessage(timeOffItem);
        }
    }
}
