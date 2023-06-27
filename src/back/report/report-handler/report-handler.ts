import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { postReportMessage } from '@common/common-function';

export async function reportHandler(timeOffData:IGetTimeOffResponseBody[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const timeOffItem of timeOffData) {
        if (timeOffItem.status === 'approved') {
            postReportMessage(timeOffItem);
        }
    }
}
