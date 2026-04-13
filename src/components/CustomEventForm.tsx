"use client";

import { type FormEvent, useRef, useState } from "react";

type CustomEventFormProps = {
  onAddEvent: (
    title: string,
    startDate: string,
    endDate: string,
    startTime?: string,
    endTime?: string,
  ) => void;
};

export function CustomEventForm({ onAddEvent }: CustomEventFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  function openNativePicker(input: HTMLInputElement | null) {
    if (!input) return;
    input.focus();

    if ("showPicker" in input) {
      input.showPicker();
    }
  }

  const pickerInputClassName =
    "w-full min-h-11 cursor-pointer rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-sm text-white [color-scheme:dark] outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:opacity-100";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title || !startDate || !endDate) return;

    onAddEvent(title.trim(), startDate, endDate, startTime || undefined, endTime || undefined);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl sm:p-5">
      <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-blue-100/70">Add Custom Event</h2>
      <div className="mt-4 space-y-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Event title"
          className="w-full min-h-11 rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white outline-none placeholder:text-blue-100/50 transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 sm:text-sm"
          required
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">Start Date</span>
            <input
              ref={startDateRef}
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              onClick={() => openNativePicker(startDateRef.current)}
              className={pickerInputClassName}
              required
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">End Date</span>
            <input
              ref={endDateRef}
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              onClick={() => openNativePicker(endDateRef.current)}
              className={pickerInputClassName}
              required
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">Start Time (Optional)</span>
            <input
              ref={startTimeRef}
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              onClick={() => openNativePicker(startTimeRef.current)}
              className={pickerInputClassName}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-100/70">End Time (Optional)</span>
            <input
              ref={endTimeRef}
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              onClick={() => openNativePicker(endTimeRef.current)}
              className={pickerInputClassName}
            />
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="mt-5 min-h-11 w-full rounded-xl border border-cyan-300/40 bg-gradient-to-r from-indigo-500/70 to-cyan-500/70 px-4 py-2.5 text-sm font-medium text-white transition hover:from-indigo-500 hover:to-cyan-500 sm:w-auto"
      >
        Add Event
      </button>
    </form>
  );
}
