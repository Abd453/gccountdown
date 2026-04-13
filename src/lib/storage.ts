import type { GraduationEvent } from "@/lib/types";

const STORAGE_KEY = "graduation-custom-events";

function isValidEvent(event: unknown): event is GraduationEvent {
  if (!event || typeof event !== "object") return false;

  const candidate = event as GraduationEvent;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.startDate === "string" &&
    typeof candidate.endDate === "string" &&
    (candidate.startTime === undefined || typeof candidate.startTime === "string") &&
    (candidate.endTime === undefined || typeof candidate.endTime === "string") &&
    candidate.source === "custom"
  );
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
