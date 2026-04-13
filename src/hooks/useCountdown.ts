"use client";

import { useEffect, useState } from "react";
import type { Countdown } from "@/lib/types";

const SECOND_MS = 1000;

function calculateCountdown(targetDate: Date): Countdown {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function useCountdown(targetDate: Date): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => calculateCountdown(targetDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, SECOND_MS);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
