import { motion } from "framer-motion";

type ProgressCardProps = {
  progress: number;
};

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-blue-100/70 sm:text-sm sm:tracking-[0.17em]">Journey Progress</h2>
        <span className="shrink-0 text-lg font-semibold text-white">{progress.toFixed(1)}%</span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300"
        />
      </div>
    </motion.section>
  );
}
