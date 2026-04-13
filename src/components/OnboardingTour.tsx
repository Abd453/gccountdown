"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

type TourStep = {
  title: string;
  description: string;
  targetId?: string;
};

const STORAGE_KEY = "graduation-tour-completed";

const STEPS: TourStep[] = [
  {
    title: "Welcome to Graduation Countdown",
    description:
      "This space helps you track your major academic milestones and your personal events on the way to graduation.",
  },
  {
    title: "Main Countdown",
    description:
      "This timer shows exactly how much time is left until graduation day, updating every second.",
    targetId: "tour-countdown",
  },
  {
    title: "Fixed Milestones",
    description:
      "These academic milestones are fixed and always stay at the top so your core deadlines stay consistent.",
    targetId: "tour-fixed-events",
  },
  {
    title: "Your Custom Events",
    description:
      "You can add your own events here. They stay saved in your browser so they are still here after refresh.",
    targetId: "tour-custom-events",
  },
  {
    title: "Smart Notifications",
    description:
      "Enable reminders to get notified before key events, on event day, and when an event is active.",
    targetId: "tour-notifications",
  },
  {
    title: "You Are Ready",
    description:
      "You are all set. Start adding your events and keep your graduation journey organized and focused.",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) !== "1";
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window === "undefined") return { width: 1280, height: 900 };
    return { width: window.innerWidth, height: window.innerHeight };
  });

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const isWelcomeStep = stepIndex === 0;
  const isSmallScreen = viewport.width < 640;
  const isTabletScreen = viewport.width >= 640 && viewport.width < 1100;

  useEffect(() => {
    if (typeof window === "undefined") return;

    function syncViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const scrollToTarget = useCallback((targetId?: string) => {
    if (!targetId || typeof window === "undefined") return;

    const tryScroll = (): boolean => {
      const target = document.getElementById(targetId);
      if (!target) return false;

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // A follow-up alignment pass helps on mobile where layout/keyboard shifts can occur.
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 260);

      return true;
    };

    if (tryScroll()) return;

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= 6) {
        window.clearInterval(intervalId);
      }
    }, 80);
  }, []);

  function goToStep(nextIndex: number) {
    const bounded = Math.min(STEPS.length - 1, Math.max(0, nextIndex));
    const nextStep = STEPS[bounded];
    scrollToTarget(nextStep.targetId);
    setStepIndex(bounded);
  }

  useEffect(() => {
    if (!isOpen) return;
    if (!step.targetId) return;

    scrollToTarget(step.targetId);

    function syncSpotlight() {
      const target = document.getElementById(step.targetId ?? "");
      if (!target) {
        setSpotlightRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const padding = 10;

      setSpotlightRect({
        top: Math.max(8, rect.top - padding),
        left: Math.max(8, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    }

    const frameId = window.requestAnimationFrame(syncSpotlight);
    window.addEventListener("resize", syncSpotlight);
    window.addEventListener("scroll", syncSpotlight, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", syncSpotlight);
      window.removeEventListener("scroll", syncSpotlight);
    };
  }, [isOpen, step.targetId, scrollToTarget]);

  const activeSpotlightRect = step.targetId ? spotlightRect : null;

  const cardPositionStyle = useMemo(() => {
    if (isTabletScreen) {
      return {
        top: "auto",
        bottom: 20,
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)",
      } as const;
    }

    if (isSmallScreen) {
      return {
        top: "auto",
        bottom: 14,
        left: 12,
        right: 12,
        transform: "none",
      } as const;
    }

    if (!activeSpotlightRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      } as const;
    }

    const viewportHeight = viewport.height;
    const viewportWidth = viewport.width;
    const cardWidth = Math.min(viewportWidth * 0.9, 480);
    const placeAbove = activeSpotlightRect.top > viewportHeight * 0.62;
    const baseTop = placeAbove
      ? Math.max(16, activeSpotlightRect.top - 210)
      : activeSpotlightRect.top + activeSpotlightRect.height + 14;
    const safeTop = Math.min(baseTop, Math.max(16, viewportHeight - 230));
    const safeLeft = Math.min(
      Math.max(16, activeSpotlightRect.left),
      Math.max(16, viewportWidth - cardWidth - 16),
    );

    return {
      top: safeTop,
      left: safeLeft,
      transform: "none",
    } as const;
  }, [activeSpotlightRect, isSmallScreen, isTabletScreen, viewport.height, viewport.width]);

  function finishTour() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-[70]"
      >
        {activeSpotlightRect ? (
          <motion.div
            layout
            transition={{ duration: 0.25 }}
            className="absolute rounded-xl border border-cyan-300/55 sm:rounded-2xl"
            style={{
              top: activeSpotlightRect.top,
              left: activeSpotlightRect.left,
              width: activeSpotlightRect.width,
              height: activeSpotlightRect.height,
              boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.78)",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950/80" />
        )}

        <motion.section
          key={stepIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="pointer-events-auto absolute w-[min(92vw,30rem)] max-h-[78vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/95 p-4 shadow-2xl shadow-black/60 sm:w-[min(88vw,34rem)] sm:p-5"
          style={cardPositionStyle}
        >
          <p className={`text-[11px] uppercase tracking-[0.2em] text-cyan-200/70 ${isWelcomeStep ? "text-center" : ""}`}>
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <h3 className={`mt-2 text-base font-semibold text-white sm:text-lg ${isWelcomeStep ? "text-center" : ""}`}>
            {step.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed text-blue-100/85 ${isWelcomeStep ? "text-center" : ""}`}>
            {step.description}
          </p>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={finishTour}
              className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs text-blue-100/90 transition hover:bg-white/10"
            >
              Skip
            </button>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => goToStep(stepIndex - 1)}
                className="rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs text-blue-100/90 transition hover:bg-white/10 disabled:opacity-45"
                disabled={isFirst}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLast) {
                    finishTour();
                    return;
                  }
                  goToStep(stepIndex + 1);
                }}
                className="rounded-lg border border-cyan-300/45 bg-gradient-to-r from-indigo-500/75 to-cyan-500/75 px-3 py-2 text-xs font-medium text-white transition hover:from-indigo-500 hover:to-cyan-500"
              >
                {isLast ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
