export type EventSource = "system" | "custom";

export type GraduationEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  source: EventSource;
};

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
