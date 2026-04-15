"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { EditEventModal } from "@/components/EditEventModal";
import { CountdownCard } from "@/components/CountdownCard";
import { CustomEventForm } from "@/components/CustomEventForm";
import { EventCard } from "@/components/EventCard";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ProgressCard } from "@/components/ProgressCard";
import { ToastMessage } from "@/components/ToastMessage";
import { TodayPanel } from "@/components/TodayPanel";
import { useCountdown } from "@/hooks/useCountdown";
import {
  calculateProgress,
  getEventNotificationCondition,
  getEventDateTimeRange,
  getActiveEvents,
  getDailyMotivation,
  getDaysUntil,
  getJourneyStartReference,
  getTodayEventCountdowns,
  getUrgencyTone,
  parseLocalDate,
  PREDEFINED_EVENTS,
  sortCustomEventsChronologically,
} from "@/lib/events";
import { loadCustomEvents, saveCustomEvents } from "@/lib/storage";
import type { GraduationEvent } from "@/lib/types";

const GRADUATION_DATE = parseLocalDate("2026-06-20");
const JOURNEY_START = parseLocalDate("2026-01-01");

export default function Home() {
  const countdown = useCountdown(GRADUATION_DATE);
  const [customEvents, setCustomEvents] = useState<GraduationEvent[]>(() => loadCustomEvents());
  const [eventPendingDelete, setEventPendingDelete] = useState<GraduationEvent | null>(null);
  const [eventPendingEdit, setEventPendingEdit] = useState<GraduationEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">(() => {
      if (typeof window === "undefined") return "default";
      if (!("Notification" in window)) return "unsupported";
      return Notification.permission;
    });

  useEffect(() => {
    saveCustomEvents(customEvents);
  }, [customEvents]);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const now = new Date();
  const fixedEvents = PREDEFINED_EVENTS;
  const sortedCustomEvents = useMemo(
    () => sortCustomEventsChronologically(customEvents),
    [customEvents],
  );
  const allEvents = useMemo(
    () => [...fixedEvents, ...sortedCustomEvents],
    [fixedEvents, sortedCustomEvents],
  );
  const progressStart = useMemo(
    () => getJourneyStartReference(JOURNEY_START, PREDEFINED_EVENTS),
    [],
  );
  const todayCountdowns = getTodayEventCountdowns(allEvents, now);
  const activeToday = getActiveEvents(allEvents, now);
  const daysUntilGraduation = getDaysUntil(GRADUATION_DATE, now);
  const urgencyTone = getUrgencyTone(daysUntilGraduation);
  const progress = calculateProgress(now, progressStart, GRADUATION_DATE);
  const motivationMessage = getDailyMotivation(now);
  const hasImportantUpcomingOrActiveEvent = allEvents.some(
    (event) => {
      const condition = getEventNotificationCondition(event, now);
      if (!condition) return false;

      if (condition === "starts-today") {
        const { start } = getEventDateTimeRange(event);
        return now.getTime() >= start.getTime();
      }

      return true;
    },
  );

  useEffect(() => {
    if (notificationPermission !== "granted") return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    allEvents.forEach((event) => {
      const condition = getEventNotificationCondition(event, new Date());
      let title = "";
      let body = "";

      if (condition === "week-before") {
        title = `One Week Away: ${event.title}`;
        body = "This event is one week away. Start preparing now.";
      } else if (condition === "day-before") {
        title = `Starts Tomorrow: ${event.title}`;
        body = "Quick heads-up: this event begins tomorrow.";
      } else if (condition === "starts-today") {
        title = `Event Starts Today: ${event.title}`;
        body = "This event starts today. Stay sharp and make it count.";
      } else if (condition === "ongoing-open") {
        title = `Ongoing Event: ${event.title}`;
        body = "You opened the app during an active event.";
      }

      if (!condition) return;

      const notificationKey = `event-notification-${event.id}-${condition}`;
      const alreadyNotified = window.localStorage.getItem(notificationKey);

      if (alreadyNotified) return;

      new Notification(title, {
        body,
        tag: `gc-${event.id}-${condition}`,
        requireInteraction: true,
      });
      window.localStorage.setItem(notificationKey, "1");
    });
  }, [allEvents, notificationPermission]);

  async function requestNotificationPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }

  function handleAddEvent(
    title: string,
    startDate: string,
    endDate: string,
    startTime?: string,
    endTime?: string,
  ) {
    const startDateTime = new Date(parseLocalDate(startDate));
    const endDateTime = new Date(parseLocalDate(endDate));

    if (startTime) {
      const [hours, minutes] = startTime.split(":").map(Number);
      startDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    }

    if (endTime) {
      const [hours, minutes] = endTime.split(":").map(Number);
      endDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    } else {
      endDateTime.setHours(23, 59, 59, 999);
    }

    if (endDateTime.getTime() < startDateTime.getTime()) {
      return;
    }

    const newEvent: GraduationEvent = {
      id: `custom-${Date.now()}`,
      title,
      startDate,
      endDate,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      source: "custom",
    };

    setCustomEvents((previous) => [...previous, newEvent]);
  }

  function requestEventDelete(event: GraduationEvent) {
    setEventPendingDelete(event);
  }

  function confirmDeleteEvent() {
    if (!eventPendingDelete) return;

    setCustomEvents((previous) => previous.filter((event) => event.id !== eventPendingDelete.id));
    setToastMessage(`Deleted event: ${eventPendingDelete.title}`);
    setEventPendingDelete(null);
  }

  function requestEventEdit(event: GraduationEvent) {
    setEventPendingEdit(event);
  }

  function confirmEditEvent(updated: GraduationEvent) {
    setCustomEvents((previous) =>
      previous.map((event) => (event.id === updated.id ? updated : event)),
    );
    setToastMessage(`Updated event: ${updated.title}`);
    setEventPendingEdit(null);
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.38),transparent_33%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.32),transparent_37%),radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.28),transparent_35%),linear-gradient(145deg,#020617,#09090b_45%,#140b2c)]" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-blue-100/70 sm:text-xs sm:tracking-[0.3em]">Graduation Journey</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-5xl">
              Countdown to <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">June 20, 2026</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-100/75 sm:text-base">{motivationMessage}</p>
          </motion.header>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              <div id="tour-countdown">
                <CountdownCard countdown={countdown} urgencyTone={urgencyTone} />
              </div>
              <TodayPanel countdowns={todayCountdowns} />
            </section>

            <section className="space-y-4">
              <ProgressCard progress={progress} />
              <div id="tour-notifications" className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur-xl sm:p-5">
                <h2 className="text-sm font-medium uppercase tracking-[0.17em] text-blue-100/70">Notifications</h2>
                <p className="mt-3 text-sm text-blue-100/80">
                  {notificationPermission === "granted" && "Notifications are enabled."}
                  {notificationPermission === "default" &&
                    "Enable notifications to get alerts for starting and active events."}
                  {notificationPermission === "denied" &&
                    "Notifications are blocked in this browser."}
                  {notificationPermission === "unsupported" &&
                    "This browser does not support notifications."}
                </p>
                {hasImportantUpcomingOrActiveEvent && notificationPermission !== "granted" ? (
                  <p className="mt-2 rounded-lg border border-amber-300/30 bg-amber-500/15 px-3 py-2 text-xs text-amber-100">
                    Important events are near or active. Enable notifications for better visibility on mobile.
                  </p>
                ) : null}
                <button
                  onClick={requestNotificationPermission}
                  type="button"
                  className="mt-4 min-h-11 w-full rounded-xl border border-cyan-300/45 bg-gradient-to-r from-indigo-500/70 to-cyan-500/70 px-4 py-2 text-sm font-medium text-white transition hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 sm:w-auto"
                  disabled={notificationPermission === "unsupported"}
                >
                  Request Notification Permission
                </button>
                <p className="mt-2 text-xs text-blue-100/65">
                  Tip: browser notifications work best on mobile when allowed in browser settings.
                </p>
              </div>
              <div id="tour-custom-events" className="space-y-4">
                <CustomEventForm onAddEvent={handleAddEvent} />
                {showWelcome ? (
                  <div className="rounded-2xl border border-cyan-300/25 bg-cyan-500/10 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <p className="text-xs leading-relaxed text-cyan-100/90">
                        Welcome to your Graduation Countdown. Add your own events, manage them anytime, and keep track of everything in one place. Your events stay saved in this browser, even after refreshing the page.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowWelcome(false)}
                        className="w-full rounded-md border border-cyan-200/30 bg-white/5 px-2 py-1.5 text-xs text-cyan-100/85 transition hover:bg-white/10 sm:w-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6"
            id="tour-fixed-events"
          >
            <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.17em] text-blue-100/70">Important Events</h2>
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-blue-100/55">Milestones</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {fixedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isActiveToday={activeToday.some((activeEvent) => activeEvent.id === event.id)}
                  onRequestDelete={requestEventDelete}
                />
              ))}
            </div>

            {sortedCustomEvents.length > 0 ? (
              <>
                <p className="mb-2 mt-5 text-xs uppercase tracking-[0.16em] text-blue-100/55">Your Events</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {sortedCustomEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      isActiveToday={activeToday.some((activeEvent) => activeEvent.id === event.id)}
                      onRequestDelete={requestEventDelete}
                      onRequestEdit={requestEventEdit}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </motion.section>

          <footer className="mt-20 block border-t border-white/5 pb-10 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100/40">Open Source Project</p>
                <p className="mt-1 text-xs text-blue-100/60">© 2026 GC Countdown. Built for the graduating class.</p>
              </div>
              
              <div className="flex flex-col items-center gap-4 sm:items-end">
                <p className="text-center text-sm text-blue-100/80 sm:text-right">
                  Show some love by starring the repo! 🚀
                </p>
                <a
                  href="https://github.com/Abd453/gccountdown"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 text-sm font-semibold text-yellow-200 transition-all hover:bg-yellow-400/20 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                  <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <ConfirmDeleteModal
        open={Boolean(eventPendingDelete)}
        onCancel={() => setEventPendingDelete(null)}
        onConfirm={confirmDeleteEvent}
      />
      <EditEventModal
        event={eventPendingEdit}
        onCancel={() => setEventPendingEdit(null)}
        onSave={confirmEditEvent}
      />
      <ToastMessage message={toastMessage} />
      <OnboardingTour />
    </>
  );
}
