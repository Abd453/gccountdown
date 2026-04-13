import { motion } from "framer-motion";
import type { GraduationEvent } from "@/lib/types";

type TodayPanelProps = {
  events: GraduationEvent[];
};

export function TodayPanel({ events }: TodayPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="rounded-3xl border border-fuchsia-300/45 bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/15 to-blue-500/15 p-5 shadow-xl shadow-fuchsia-900/30 backdrop-blur-xl"
    >
      <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-fuchsia-100/90">Happening Today</h2>
      {events.length === 0 ? (
        <p className="mt-3 text-sm text-blue-100/80">No major events today. Stay focused and keep your momentum.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((event) => (
            <li key={event.id} className="rounded-xl border border-fuchsia-200/30 bg-black/30 px-3 py-2 text-sm text-white">
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
