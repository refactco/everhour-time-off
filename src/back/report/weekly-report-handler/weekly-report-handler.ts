import { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';
import { createReportMessage, formatDateRange } from '@common/common-function';
import { postMessage } from '@back/packages/slack-manager/messenger/messenger';

export async function weeklyReportHandler(timeOffData:IGetTimeOffResponseBody[]) {
    const reportMessages : string[] = ['*Team members off this week:*'];
    // eslint-disable-next-line no-restricted-syntax
    for (const timeOffItem of timeOffData) {
        if (timeOffItem.status === 'approved') {
            const { startDate, endDate, timeOffPeriod, user, time } = timeOffItem;
            const formatedTime: number = time ? time / 3600 : 0;
            const formatedDateRange: string = formatDateRange(startDate, endDate);
            const message = createReportMessage(user.name, formatedDateRange, timeOffPeriod, formatedTime);
            reportMessages.push(message);
        }
    }
    const reportMessage: string = reportMessages.join('\n\n');

    await postMessage({
        channelID: process.env.REPORT_CHANNEL_ID ?? '',
        message: reportMessage,
    });
}
