export type CheckIn = {
  id: string;
  dateAndTime: string;
  drank: boolean | null;
  reductionPeriodId?: string;
};

// export type ReductionPeriod = {
//   duration: number;
//   target: number | null;
//   daysDry: number;
//   daysWet: number;
//   missedDays: number;
//   userCheckIn: CheckIn[];
//   startDate: string;
//   endDate: string;
//   id: string;
// };

export type ReductionPeriod = {
  id: string;
  duration: number;
  target: number | null;
  days_dry: number;
  days_wet: number;
  missed_days: number;
  current_streak: number;
  start_date: string;
  end_date: string;
};

export type Streak = {
  currentCount: number;
  userCheckIn: CheckIn[];
  startDate: string;
  endDate: string;
  id: string;
};
