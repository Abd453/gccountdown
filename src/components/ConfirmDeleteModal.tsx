import { AnimatePresence, motion } from "framer-motion";

type ConfirmDeleteModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({ open, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/95 p-5 shadow-2xl shadow-black/50"
          >
            <h3 className="text-base font-semibold text-white">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-blue-100/80">Are you sure you want to delete this event?</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-xl border border-rose-400/45 bg-rose-500/25 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/35"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
