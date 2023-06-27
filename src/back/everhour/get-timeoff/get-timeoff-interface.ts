export interface IEverHourUser {
    avatarUrl: string;
    avatarUrlLarge: string;
    id: number;
    email: string;
    name: string;
    headline: string;
    capacity: number;
    cost: number;
    costHistory: any;
}
export interface IEverhourTimeOffType {
    id: number;
    name: string;
    color: string;
    paid: boolean;
}

export interface IEverHourApprovedBy {
    name: string;
}

export interface IGetTimeOffResponseBody {
    time: number;
    timeOffDurationType: string;
    createdBy: number;
    updatedBy: number;
    id: number;
    user: IEverHourUser;
    timeOffType: IEverhourTimeOffType;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    note: string;
    createdAt: string;
    updatedAt: string;
    includeWeekends: boolean;
    status: string;
    timeOffPeriod?: string;
    approvedBy?:IEverHourApprovedBy;
}

export interface IGetTimeOffRequestBody{
    from: string;
    to: string;
    type: string;
}
