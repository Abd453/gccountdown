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
    "w-full cursor-pointer rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none transition focus:border-cyan-300/70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:opacity-100";

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
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
      <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-blue-100/70">Add Custom Event</h2>
      <div className="mt-4 space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Event title"
          className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-blue-100/50 focus:border-cyan-300/70"
          required
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            ref={startDateRef}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            onClick={() => openNativePicker(startDateRef.current)}
            className={pickerInputClassName}
            required
          />
          <input
            ref={endDateRef}
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            onClick={() => openNativePicker(endDateRef.current)}
            className={pickerInputClassName}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            ref={startTimeRef}
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            onClick={() => openNativePicker(startTimeRef.current)}
            className={pickerInputClassName}
          />
          <input
            ref={endTimeRef}
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            onClick={() => openNativePicker(endTimeRef.current)}
            className={pickerInputClassName}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 rounded-xl border border-cyan-300/40 bg-gradient-to-r from-indigo-500/70 to-cyan-500/70 px-4 py-2 text-sm font-medium text-white transition hover:from-indigo-500 hover:to-cyan-500"
      >
        Add Event
      </button>
    </form>
  );
}
