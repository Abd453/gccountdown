import { motion } from "framer-motion";
import type { Countdown } from "@/lib/types";

type CountdownCardProps = {
  countdown: Countdown;
  urgencyTone: "green" | "yellow" | "red";
};

const urgencyClasses = {
  green: "border-emerald-400/40 shadow-emerald-500/20",
  yellow: "border-amber-300/50 shadow-amber-500/20",
  red: "border-rose-400/50 shadow-rose-500/20",
};

export function CountdownCard({ countdown, urgencyTone }: CountdownCardProps) {
  const blocks = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl border bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-7 ${urgencyClasses[urgencyTone]}`}
    >
      <p className="text-xs uppercase tracking-[0.25em] text-indigo-200/80">Graduation Countdown</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="rounded-2xl border border-white/15 bg-black/25 px-3 py-4 text-center sm:px-4"
          >
            <p className="text-3xl font-semibold tabular-nums text-white sm:text-4xl">{block.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-blue-100/70">{block.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
