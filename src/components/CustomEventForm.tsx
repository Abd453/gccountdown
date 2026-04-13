"use client";

import { type FormEvent, useState } from "react";

type CustomEventFormProps = {
  onAddEvent: (title: string, startDate: string, endDate: string) => void;
};

export function CustomEventForm({ onAddEvent }: CustomEventFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title || !startDate || !endDate) return;

    onAddEvent(title.trim(), startDate, endDate);
    setTitle("");
    setStartDate("");
    setEndDate("");
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
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/70"
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/70"
            required
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
