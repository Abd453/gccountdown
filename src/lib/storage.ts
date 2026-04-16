import type { GraduationEvent } from "@/lib/types";

const STORAGE_KEY = "graduation-custom-events";

function isValidEvent(event: unknown): event is GraduationEvent {
  if (!event || typeof event !== "object") return false;

  const candidate = event as GraduationEvent;
  
  const hasValidFields = 
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.startDate === "string" &&
    typeof candidate.endDate === "string" &&
    (candidate.startTime === undefined || typeof candidate.startTime === "string") &&
    (candidate.endTime === undefined || typeof candidate.endTime === "string") &&
    candidate.source === "custom";

  if (!hasValidFields) return false;

  // Basic date format validation YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(candidate.startDate) || !dateRegex.test(candidate.endDate)) return false;

  // Check logically valid dates
  const start = new Date(candidate.startDate);
  const end = new Date(candidate.endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  if (end.getTime() < start.getTime()) return false;

  return true;
}

export function loadCustomEvents(): GraduationEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidEvent);
  } catch {
    return [];
  }
}

export function saveCustomEvents(events: GraduationEvent[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
