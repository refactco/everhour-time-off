import type { IGetTimeOffResponseBody } from '@back/everhour/get-timeoff/get-timeoff-interface';

export interface IShouldUpdatedEvents extends IGetTimeOffResponseBody{
    eventId: string | null | undefined;
}
