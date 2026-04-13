import { motion } from "framer-motion";
import { formatDurationHMS, type TodayEventCountdown } from "@/lib/events";

type TodayPanelProps = {
  countdowns: TodayEventCountdown[];
};

export function TodayPanel({ countdowns }: TodayPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="rounded-3xl border border-fuchsia-300/45 bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/15 to-blue-500/15 p-5 shadow-xl shadow-fuchsia-900/30 backdrop-blur-xl"
    >
      <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-fuchsia-100/90">Happening Today</h2>
      {countdowns.length === 0 ? (
        <p className="mt-3 text-sm text-blue-100/80">No major events today. Stay focused and keep your momentum.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {countdowns.map((item) => (
            <li
              key={item.event.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-fuchsia-200/30 bg-black/30 px-3 py-2 text-sm text-white"
            >
              <span className="min-w-0 truncate text-white/95">{item.event.title}</span>
              <span className="inline-flex shrink-0 items-center rounded-full border border-fuchsia-300/20 bg-white/5 px-3 py-1 text-xs font-medium text-fuchsia-100/95">
                <span className="text-fuchsia-100/80">{item.status === "starts" ? "Starts in" : "Ends in"}</span>
                <span className="ml-3 font-mono tabular-nums tracking-[0.18em] text-fuchsia-50">
                  {formatDurationHMS(item.remainingMs)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
