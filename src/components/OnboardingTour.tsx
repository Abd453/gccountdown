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
  const isModalStep = !step.targetId;

  useEffect(() => {
    if (typeof window === "undefined") return;

    function syncViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const scrollToTarget = useCallback((targetId?: string) => {
    if (typeof window === "undefined") return;

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    
    // Calculate position to center the element in the viewport
    const targetTop = rect.top + scrollTop - (clientHeight / 2) + (rect.height / 2);

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });

    // Verification and adjustment pass
    window.setTimeout(() => {
      const updatedTarget = document.getElementById(targetId);
      if (!updatedTarget) return;
      
      const newRect = updatedTarget.getBoundingClientRect();
      const isCentered = Math.abs(newRect.top + newRect.height / 2 - clientHeight / 2) < 50;
      
      if (!isCentered) {
        updatedTarget.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 450);
  }, []);

  function goToStep(nextIndex: number) {
    const bounded = Math.min(STEPS.length - 1, Math.max(0, nextIndex));
    const nextStep = STEPS[bounded];
    scrollToTarget(nextStep.targetId);
    setStepIndex(bounded);
  }

  useEffect(() => {
    if (!isOpen) return;
    
    // Always apply scroll logic when step changes
    scrollToTarget(step.targetId);

    if (!step.targetId) {
      setSpotlightRect(null);
      return;
    }

    function syncSpotlight() {
      const target = document.getElementById(step.targetId ?? "");
      if (!target) {
        setSpotlightRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const padding = 12;

      setSpotlightRect({
        top: Math.max(8, rect.top - padding),
        left: Math.max(8, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    }

    // Immediate sync
    syncSpotlight();

    const frameId = window.requestAnimationFrame(syncSpotlight);
    window.addEventListener("resize", syncSpotlight);
    window.addEventListener("scroll", syncSpotlight, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", syncSpotlight);
      window.removeEventListener("scroll", syncSpotlight);
    };
  }, [isOpen, stepIndex, step.targetId, scrollToTarget]);

  const activeSpotlightRect = step.targetId ? spotlightRect : null;

  const cardPositionStyle = useMemo(() => {
    if (isModalStep) {
      return {} as const; // Managed by container
    }

    if (isSmallScreen) {
      return {
        position: "fixed",
        bottom: 24,
        left: 16,
        right: 16,
        width: "auto",
        transform: "none",
      } as const;
    }

    if (!activeSpotlightRect) return {} as const;

    const viewportHeight = viewport.height;
    const viewportWidth = viewport.width;
    const cardWidth = 440;
    const estimatedCardHeight = 220;
    
    const spaceBelow = viewportHeight - (activeSpotlightRect.top + activeSpotlightRect.height);
    const spaceAbove = activeSpotlightRect.top;
    
    // Default to placing below if there's enough space, otherwise above
    const placeAbove = spaceBelow < estimatedCardHeight + 40 && spaceAbove > spaceBelow;
    
    let top: number;
    if (placeAbove) {
      top = activeSpotlightRect.top - estimatedCardHeight - 24;
    } else {
      top = activeSpotlightRect.top + activeSpotlightRect.height + 24;
    }

    // Clamp top position
    top = Math.max(20, Math.min(top, viewportHeight - estimatedCardHeight - 40));

    // Align horizontally with the spotlight, but stay in viewport
    let left = activeSpotlightRect.left + (activeSpotlightRect.width / 2) - (cardWidth / 2);
    left = Math.max(20, Math.min(left, viewportWidth - cardWidth - 20));

    return {
      position: "fixed",
      top,
      left,
      width: cardWidth,
      transform: "none",
    } as const;
  }, [activeSpotlightRect, isModalStep, isSmallScreen, viewport.height, viewport.width]);

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

        <div className={`pointer-events-none fixed inset-0 z-[80] flex p-4 ${isModalStep ? "items-center justify-center" : "items-start justify-start"}`}>
          <motion.section
            key={stepIndex}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto relative flex max-h-[85vh] w-full max-w-[min(92vw,440px)] flex-col overflow-y-auto rounded-3xl border border-white/20 bg-slate-950/95 p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-7"
            style={cardPositionStyle}
          >
            <div className="flex items-center justify-between">
              <p className={`text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/80 ${isWelcomeStep ? "w-full text-center" : ""}`}>
                Step {stepIndex + 1} of {STEPS.length}
              </p>
            </div>
            
            <h3 className={`mt-3 text-lg font-bold text-white sm:text-xl ${isWelcomeStep ? "text-center" : ""}`}>
              {step.title}
            </h3>
            
            <p className={`mt-3 text-[15px] leading-relaxed text-blue-50/90 ${isWelcomeStep ? "text-center" : ""}`}>
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
      </div>
    </motion.div>
  </AnimatePresence>
);
}
