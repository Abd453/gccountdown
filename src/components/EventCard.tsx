import { motion } from "framer-motion";
import { formatEventRange, getDaysUntil, getUrgencyTone, parseLocalDate } from "@/lib/events";
import type { GraduationEvent } from "@/lib/types";

type EventCardProps = {
  event: GraduationEvent;
  index: number;
  isActiveToday: boolean;
  onRequestDelete?: (event: GraduationEvent) => void;
};

const urgencyStyles = {
  green: "text-emerald-300",
  yellow: "text-amber-300",
  red: "text-rose-300",
};

export function EventCard({ event, index, isActiveToday, onRequestDelete }: EventCardProps) {
  const daysUntilStart = getDaysUntil(parseLocalDate(event.startDate));
  const tone = getUrgencyTone(daysUntilStart);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 * index }}
      className={`group rounded-2xl border bg-white/8 p-4 backdrop-blur-lg ${
        isActiveToday
          ? "border-fuchsia-300/70 shadow-lg shadow-fuchsia-500/30"
          : "border-white/12 shadow-md shadow-black/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-blue-100/70">{formatEventRange(event.startDate, event.endDate)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isActiveToday ? (
            <span className="rounded-full border border-fuchsia-300/60 bg-fuchsia-500/20 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-fuchsia-100">
              Today
            </span>
          ) : null}
          {event.source === "custom" && onRequestDelete ? (
            <button
              type="button"
              onClick={() => onRequestDelete(event)}
              className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-2 py-1 text-xs font-medium text-rose-100 transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-rose-500/25"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
      <p className={`mt-3 text-sm ${urgencyStyles[tone]}`}>
        {daysUntilStart >= 0
          ? `${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"} left`
          : "Event started"}
      </p>
    </motion.article>
  );
}
