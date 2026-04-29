"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseLocalDate, getDaysUntil } from "@/lib/events";

// 2026-05-07 is the Thesis Defense (5th Year Graduation Defense)
const DEFENSE_DATE = parseLocalDate("2026-05-07");

export function MotivationalMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [daysLeft, setDaysLeft] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const now = new Date();
    const days = getDaysUntil(DEFENSE_DATE, now);

    // Trigger only on exactly 9, 5, or 0 days remaining
    if (days !== 9 && days !== 5 && days !== 0) return;

    const todayStr = now.toISOString().split("T")[0];
    const lastShown = localStorage.getItem("motivational_message_shown");

    // Only show once per day. 
    // To allow continuous testing, we only update localStorage when the user dismisses the modal.
    if (lastShown === todayStr) {
      return;
    }

    setDaysLeft(days);

    if (days === 9) {
      setTitle("9 Days Remaining!");
      setMessage("Nine days left until the 5th Year Graduation Defense! Buckle up, do not give up, and push through this final stretch. You've got this!");
    } else if (days === 5) {
      setTitle("Only 5 Days Left!");
      setMessage("Only five days remaining! The finish line is in sight. Keep your focus sharp and your energy high. You are almost there!");
    } else if (days === 0) {
      setTitle("Today is the Day!");
      setMessage("Today is the day! The 5th Year Graduation Defense is here. Take a deep breath, trust your preparation, and go show them what you've achieved!");
    }

    setIsOpen(true);
  }, []);

  const playAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(message);
      
      const voices = window.speechSynthesis.getVoices();
      // Prefer a natural English female voice if available
      const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha")) || voices.find(v => v.lang.startsWith("en"));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClose = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem("motivational_message_shown", todayStr);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-[80px] pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/30 blur-[80px] pointer-events-none" />

            <div className="relative p-6 sm:p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
              
              <p className="mb-6 text-base leading-relaxed text-blue-100/80 sm:text-lg">
                {message}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={playAudio}
                  className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    isPlaying 
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                      : "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/30"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <div className="flex gap-1">
                        <div className="h-2 w-1 animate-pulse bg-cyan-400 rounded-full"></div>
                        <div className="h-3 w-1 animate-pulse bg-cyan-400 rounded-full delay-75"></div>
                        <div className="h-2 w-1 animate-pulse bg-cyan-400 rounded-full delay-150"></div>
                      </div>
                      Playing...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Listen to Message
                    </>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
                >
                  I'm Ready!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
