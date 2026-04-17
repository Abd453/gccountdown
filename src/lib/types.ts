export type EventSource = "system" | "custom";

export type GraduationEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  detailsUrl?: string;
  congratsMessage?: string;
  source: EventSource;
};

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete?: boolean;
};
