"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatEventRange, getDaysUntil, getUrgencyTone, parseLocalDate } from "@/lib/events";
import type { GraduationEvent } from "@/lib/types";

type EventCardProps = {
  event: GraduationEvent;
  index: number;
  isActiveToday: boolean;
  onRequestDelete?: (event: GraduationEvent) => void;
  onRequestEdit?: (event: GraduationEvent) => void;
  // bulk-select
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
};

const urgencyStyles = {
  green: "text-emerald-300",
  yellow: "text-amber-300",
  red: "text-rose-300",
};

export function EventCard({
  event,
  index,
  isActiveToday,
  onRequestDelete,
  onRequestEdit,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}: EventCardProps) {
  const daysUntilStart = getDaysUntil(parseLocalDate(event.startDate));
  const tone = getUrgencyTone(daysUntilStart);
  const isExternalInfoLink =
    typeof event.detailsUrl === "string" && /^https?:\/\//i.test(event.detailsUrl);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 * index }}
      onClick={isSelectionMode && onToggleSelect ? () => onToggleSelect(event.id) : undefined}
      className={`group rounded-2xl border bg-white/8 p-4 backdrop-blur-lg transition-shadow ${
        isSelectionMode ? "cursor-pointer select-none" : ""
      } ${
        isSelected
          ? "border-cyan-400/70 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/40"
          : isActiveToday
          ? "border-fuchsia-300/70 shadow-lg shadow-fuchsia-500/30"
          : "border-white/12 shadow-md shadow-black/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-blue-100/70">{formatEventRange(event.startDate, event.endDate)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {isActiveToday ? (
            <span className="rounded-full border border-fuchsia-300/60 bg-fuchsia-500/20 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-fuchsia-100">
              Today
            </span>
          ) : null}

          {/* Checkbox — selection mode */}
          {isSelectionMode ? (
            <button
              type="button"
              aria-label={isSelected ? "Deselect event" : "Select event"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.(event.id);
              }}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                isSelected
                  ? "border-cyan-400 bg-cyan-400 text-black"
                  : "border-white/30 bg-white/5 text-transparent hover:border-white/60"
              }`}
            >
              {/* checkmark */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="2 6 5 9 10 3" />
              </svg>
            </button>
          ) : (
            <>
              {/* 3-dot kebab menu — custom events only */}
              {event.source === "custom" && (onRequestDelete || onRequestEdit) ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    aria-label="Event options"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/8 text-blue-100/70 transition hover:border-white/30 hover:bg-white/15 hover:text-white"
                  >
                    {/* Three vertical dots */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <circle cx="7" cy="2.5" r="1.4" />
                      <circle cx="7" cy="7" r="1.4" />
                      <circle cx="7" cy="11.5" r="1.4" />
                    </svg>
                  </button>

                  {menuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-9 z-50 min-w-[120px] overflow-hidden rounded-xl border border-white/15 bg-[#12111a] shadow-xl shadow-black/50"
                    >
                      {onRequestEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onRequestEdit(event);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-blue-100/85 transition hover:bg-white/10 hover:text-white"
                        >
                          {/* Pencil icon */}
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M11.5 2.5a2.121 2.121 0 0 1 3 3L5 15H1v-4L11.5 2.5z" />
                          </svg>
                          Edit
                        </button>
                      ) : null}
                      {onRequestDelete ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onRequestDelete(event);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-300/85 transition hover:bg-rose-500/15 hover:text-rose-200"
                        >
                          {/* Trash icon */}
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="2 4 14 4" />
                            <path d="M5 4V2h6v2" />
                            <rect x="3" y="4" width="10" height="10" rx="1" />
                            <line x1="6" y1="7" x2="6" y2="11" />
                            <line x1="10" y1="7" x2="10" y2="11" />
                          </svg>
                          Delete
                        </button>
                      ) : null}
                    </motion.div>
                  ) : null}
                </div>
              ) : null}

              {/* Info link — system events only */}
              {event.source === "system" && event.detailsUrl ? (
                isExternalInfoLink ? (
                  <a
                    href={event.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-cyan-300/35 bg-cyan-500/15 px-2 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                  >
                    Info
                  </a>
                ) : (
                  <Link
                    href={event.detailsUrl}
                    className="rounded-lg border border-cyan-300/35 bg-cyan-500/15 px-2 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/25"
                  >
                    Info
                  </Link>
                )
              ) : null}
            </>
          )}
        </div>
      </div>
      <p className={`mt-3 text-sm ${urgencyStyles[tone]}`}>
        {daysUntilStart >= 0
          ? `${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"} left`
          : "Event started"}
      </p>
    </motion.article>
  );
}
