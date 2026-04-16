"use client";

import { useEffect, useState } from "react";
import type { Countdown } from "@/lib/types";

import { calculateRemainingTime } from "@/lib/events";

const SECOND_MS = 1000;

export function useCountdown(targetDate: Date): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(() => calculateRemainingTime(targetDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(calculateRemainingTime(targetDate));
    }, SECOND_MS);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
