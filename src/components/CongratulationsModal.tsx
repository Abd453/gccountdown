"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import type { GraduationEvent } from "@/lib/types";

type CongratulationsModalProps = {
  event: GraduationEvent | null;
  onClose: () => void;
};

export function CongratulationsModal({ event, onClose }: CongratulationsModalProps) {
  useEffect(() => {
    if (event) {
      // Fire confetti when the modal opens
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start them a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      // Voice Announcement
      if ("speechSynthesis" in window) {
        // Cancel any previous speech to avoid overlapping
        window.speechSynthesis.cancel();
        
        const message = event.congratsMessage || "You've successfully completed this milestone!";
        const textToSpeak = `Great Job on completing ${event.title}! ${message}`;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      return () => {
        clearInterval(interval);
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [event]);

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
          >
            {/* Background Glow */}
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-[100px]" />
            <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-[100px]" />

            <div className="relative text-center">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </motion.div>

              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Great Job!
              </h2>
              <p className="mb-6 text-lg font-medium text-cyan-300">
                {event.title}
              </p>
              
              <div className="mb-8 rounded-2xl bg-white/5 p-6 border border-white/10 backdrop-blur-sm">
                <p className="text-lg leading-relaxed text-blue-100/90 italic">
                  "{event.congratsMessage || "You've successfully completed this milestone!"}"
                </p>
              </div>

              <button
                onClick={onClose}
                className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 p-px font-semibold text-white shadow-lg transition-transform active:scale-95"
              >
                <div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-slate-950 transition group-hover:bg-transparent">
                  Keep Going 🚀
                </div>
              </button>
              
              <p className="mt-4 text-xs text-white/30 uppercase tracking-[0.2em]">
                Graduation Journey 2026
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
