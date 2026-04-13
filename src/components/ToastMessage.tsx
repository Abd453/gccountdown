import { AnimatePresence, motion } from "framer-motion";

type ToastMessageProps = {
  message: string | null;
};

export function ToastMessage({ message }: ToastMessageProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-emerald-300/35 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-100 shadow-lg shadow-emerald-900/35 backdrop-blur-lg"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
