"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GraduationEvent } from "@/lib/types";

type EditEventModalProps = {
  event: GraduationEvent | null;
  onCancel: () => void;
  onSave: (updated: GraduationEvent) => void;
};

export function EditEventModal({ event, onCancel, onSave }: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  // Populate fields whenever a different event is passed in
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setStartTime(event.startTime ?? "");
      setEndTime(event.endTime ?? "");
    }
  }, [event]);

  function openNativePicker(input: HTMLInputElement | null) {
    if (!input) return;
    input.focus();
    if ("showPicker" in input) input.showPicker();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event || !title || !startDate || !endDate) return;

    onSave({
      ...event,
      title: title.trim(),
      startDate,
      endDate,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });
  }

  const pickerInputClassName =
    "w-full min-h-11 cursor-pointer rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-sm text-white [color-scheme:dark] outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:opacity-100";

  return (
    <AnimatePresence>
      {event ? (
        <motion.div
          key="edit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel();
          }}
        >
          <motion.div
            key="edit-panel"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-md rounded-3xl border border-white/12 bg-[#0e0c1a] p-6 shadow-2xl shadow-black/60"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-blue-100/70">
                Edit Event
              </h2>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-blue-100/60 transition hover:bg-white/10 hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11" />
                  <line x1="11" y1="1" x2="1" y2="11" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
                className="w-full min-h-11 rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white outline-none placeholder:text-blue-100/50 transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 sm:text-sm"
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">
                    Start Date
                  </span>
                  <input
                    ref={startDateRef}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={() => openNativePicker(startDateRef.current)}
                    className={pickerInputClassName}
                    required
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">
                    End Date
                  </span>
                  <input
                    ref={endDateRef}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={() => openNativePicker(endDateRef.current)}
                    className={pickerInputClassName}
                    required
                  />
                </label>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">
                    Start Time <span className="normal-case text-blue-100/45">(optional)</span>
                  </span>
                  <input
                    ref={startTimeRef}
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onClick={() => openNativePicker(startTimeRef.current)}
                    className={pickerInputClassName}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">
                    End Time <span className="normal-case text-blue-100/45">(optional)</span>
                  </span>
                  <input
                    ref={endTimeRef}
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onClick={() => openNativePicker(endTimeRef.current)}
                    className={pickerInputClassName}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 min-h-11 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-blue-100/80 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-11 rounded-xl border border-cyan-300/40 bg-gradient-to-r from-indigo-500/70 to-cyan-500/70 px-4 py-2.5 text-sm font-medium text-white transition hover:from-indigo-500 hover:to-cyan-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
