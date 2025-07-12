export type CheckIn = {
  id: string;
  dateAndTime: string;
  drank: boolean | null;
  reductionPeriodId?: string;
};

export type ReductionPeriod = {
  duration: number;
  target: number | null;
  daysDry: number;
  daysWet: number;
  missedDays: number;
  userCheckIn: CheckIn[];
  startDate: string;
  endDate: string;
  id: string;
};

export type Streak = {
  currentCount: number;
  userCheckIn: CheckIn[];
  startDate: string;
  endDate: string;
  id: string;
};
