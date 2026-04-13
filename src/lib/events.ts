import type { GraduationEvent } from "@/lib/types";

export const PREDEFINED_EVENTS: GraduationEvent[] = [
  {
    id: "final-exams",
    title: "Final Exams",
    startDate: "2026-05-11",
    endDate: "2026-05-22",
    source: "system",
  },
  {
    id: "thesis-defense",
    title: "Thesis Defense",
    startDate: "2026-05-18",
    endDate: "2026-05-22",
    source: "system",
  },
  {
    id: "exit-exam",
    title: "Exit Exam",
    startDate: "2026-06-10",
    endDate: "2026-06-17",
    source: "system",
  },
  {
    id: "graduation-day",
    title: "Graduation Day",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    source: "system",
  },
];

const DAY_MS = 1000 * 60 * 60 * 24;

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInRange(date: Date, startDate: string, endDate: string): boolean {
  const normalized = startOfDay(date).getTime();
  const start = startOfDay(parseLocalDate(startDate)).getTime();
  const end = startOfDay(parseLocalDate(endDate)).getTime();
  return normalized >= start && normalized <= end;
}

export function getActiveEvents(events: GraduationEvent[], date: Date): GraduationEvent[] {
  return events.filter((event) => isDateInRange(date, event.startDate, event.endDate));
}

export function sortEventsByStartDate(events: GraduationEvent[]): GraduationEvent[] {
  return [...events].sort(
    (a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime(),
  );
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
