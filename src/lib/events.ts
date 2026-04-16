import type { GraduationEvent } from "@/lib/types";

export type EventNotificationCondition =
  | "week-before"
  | "day-before"
  | "starts-today"
  | "ongoing-open";
export type TodayEventCountdownStatus = "starts" | "ends";

export type TodayEventCountdown = {
  event: GraduationEvent;
  status: TodayEventCountdownStatus;
  remainingMs: number;
  sortTime: number;
};

export const PREDEFINED_EVENTS: GraduationEvent[] = [
  {
    id: "exit-exam-model",
    title: "Exit Exam Model",
    startDate: "2026-04-17",
    endDate: "2026-04-17",
    detailsUrl: "https://t.me/student_Union1/2186",
    source: "system",
  },
  
  {
    id: "final-exams",
    title: "Final Exams",
    startDate: "2026-05-11",
    endDate: "2026-05-22",
    detailsUrl: "/milestone-info/final-exams",
    source: "system",
  },
  {
    id: "thesis-defense",
    title: "Thesis Defense",
    startDate: "2026-05-18",
    endDate: "2026-05-22",
    detailsUrl: "/milestone-info/thesis-defense",
    source: "system",
  },
  {
    id: "exit-exam",
    title: "Exit Exam",
    startDate: "2026-06-10",
    endDate: "2026-06-17",
    detailsUrl: "/milestone-info/exit-exam",
    source: "system",
  },
  {
    id: "graduation-day",
    title: "Graduation Day",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    detailsUrl: "/milestone-info/graduation-day",
    source: "system",
  },
];

const DAY_MS = 1000 * 60 * 60 * 24;

export function parseLocalDate(dateString: string): Date {
  if (!dateString || typeof dateString !== "string") {
    return new Date();
  }
  const parts = dateString.split("-");
  if (parts.length !== 3) {
    return new Date();
  }
  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return new Date();
  }
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function parseTimeParts(time: string | undefined): [number, number, number] {
  if (!time) return [0, 0, 0];
  const [hourPart = "0", minutePart = "0", secondPart = "0"] = time.split(":");
  const hours = Number(hourPart);
  const minutes = Number(minutePart);
  const seconds = Number(secondPart);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return [0, 0, 0];
  }

  return [hours, minutes, seconds];
}

export function getEventDateTimeRange(event: GraduationEvent): { start: Date; end: Date } {
  const startBase = parseLocalDate(event.startDate);
  const endBase = parseLocalDate(event.endDate);

  const [startHour, startMinute, startSecond] = parseTimeParts(event.startTime);
  const [endHour, endMinute, endSecond] = event.endTime
    ? parseTimeParts(event.endTime)
    : [23, 59, 59];

  const start = new Date(startBase);
  start.setHours(startHour, startMinute, startSecond, 0);

  const end = new Date(endBase);
  end.setHours(endHour, endMinute, endSecond, 999);

  return { start, end };
}

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
  const normalized = startOfDay(date).getTime();
  const start = startOfDay(parseLocalDate(startDate)).getTime();
  const end = startOfDay(parseLocalDate(endDate)).getTime();
  return normalized >= start && normalized <= end;
}

export function getActiveEvents(events: GraduationEvent[], date: Date): GraduationEvent[] {
  return events.filter((event) => {
    const { start, end } = getEventDateTimeRange(event);
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
  });
}

export function getTodayEventCountdowns(
  events: GraduationEvent[],
  now: Date,
): TodayEventCountdown[] {
  const today = startOfDay(now);

  return events
    .map((event) => {
      const { start, end } = getEventDateTimeRange(event);

      if (!isDateInRange(today, event.startDate, event.endDate)) {
        return null;
      }

      if (now.getTime() > end.getTime()) {
        return null;
      }

      if (now.getTime() < start.getTime()) {
        if (!isSameDay(start, now)) return null;
        return {
          event,
          status: "starts" as const,
          remainingMs: start.getTime() - now.getTime(),
          sortTime: start.getTime(),
        };
      }

      return {
        event,
        status: "ends" as const,
        remainingMs: end.getTime() - now.getTime(),
        sortTime: end.getTime(),
      };
    })
    .filter((entry): entry is TodayEventCountdown => entry !== null)
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "starts" ? -1 : 1;
      }

      return a.sortTime - b.sortTime;
    });
}

export function formatDurationHMS(durationMs: number): string {
  const safeMs = Math.max(0, durationMs);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;
}

export function getEventNotificationCondition(
  event: GraduationEvent,
  todayDate: Date,
): EventNotificationCondition | null {
  const today = startOfDay(todayDate);
  const tomorrow = addDays(today, 1);
  const { start, end } = getEventDateTimeRange(event);

  const weekBeforeStart = addDays(start, -7);
  const startsInOneWeek = todayDate.getTime() >= weekBeforeStart.getTime() && todayDate.getTime() < addDays(weekBeforeStart, 1).getTime();
  const startsTomorrow = isSameDay(tomorrow, startOfDay(start));
  const startsNowOrEarlierToday =
    isSameDay(todayDate, start) &&
    todayDate.getTime() >= start.getTime() &&
    todayDate.getTime() <= end.getTime();
  const isOngoing = todayDate.getTime() >= start.getTime() && todayDate.getTime() <= end.getTime();

  if (startsInOneWeek) return "week-before";
  if (startsTomorrow) return "day-before";
  if (startsNowOrEarlierToday) return "starts-today";
  if (isOngoing) return "ongoing-open";
  return null;
}

export function sortEventsByStartDate(events: GraduationEvent[]): GraduationEvent[] {
  return [...events].sort(
    (a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime(),
  );
}

export function sortCustomEventsChronologically(events: GraduationEvent[]): GraduationEvent[] {
  return [...events].sort((a, b) => {
    const aStart = getEventDateTimeRange(a).start.getTime();
    const bStart = getEventDateTimeRange(b).start.getTime();
    return aStart - bStart;
  });
}

export function getDaysUntil(targetDate: Date, currentDate = new Date()): number {
  const diffMs = startOfDay(targetDate).getTime() - startOfDay(currentDate).getTime();
  return Math.ceil(diffMs / DAY_MS);
}

export function calculateProgress(currentDate: Date, startDate: Date, endDate: Date): number {
  const total = endDate.getTime() - startDate.getTime();
  if (total <= 0) return 100;
  const elapsed = currentDate.getTime() - startDate.getTime();
  const percentage = (elapsed / total) * 100;
  return Math.min(100, Math.max(0, percentage));
}

export function getJourneyStartReference(
  fallbackStartDate: Date,
  milestones: GraduationEvent[],
): Date {
  if (milestones.length === 0) return fallbackStartDate;

  const earliestMilestone = milestones.reduce((earliest, event) => {
    const start = getEventDateTimeRange(event).start;
    return start.getTime() < earliest.getTime() ? start : earliest;
  }, getEventDateTimeRange(milestones[0]).start);

  return fallbackStartDate.getTime() <= earliestMilestone.getTime()
    ? fallbackStartDate
    : earliestMilestone;
}

export function getUrgencyTone(daysLeft: number): "green" | "yellow" | "red" {
  if (daysLeft < 10) return "red";
  if (daysLeft < 30) return "yellow";
  return "green";
}

const MESSAGES = [
  "Small progress still counts. Keep moving.",
  "You are closer than you were yesterday.",
  "Consistency beats intensity. Show up today.",
  "The finish line is built one focused day at a time.",
  "Your future self will thank you for today\'s effort.",
  "Momentum is your superpower. Keep it alive.",
  "Hard days build strong graduates.",
];

export function getDailyMotivation(date = new Date()): string {
  const yearStart = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / DAY_MS);
  return MESSAGES[dayOfYear % MESSAGES.length];
}

export function formatEventRange(startDate: string, endDate: string): string {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (startDate === endDate) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}
