export interface ICreateShift {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateShift {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  weekId?: string;
}

export interface IPayloadIsClashing {
  date: string;
  startTime: string;
  endTime: string;
}