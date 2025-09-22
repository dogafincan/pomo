"use client";

import { Settings, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Phase = "work" | "short-break" | "long-break";

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 30;

const PHASE_DURATION_SECONDS: Record<Phase, number> = {
  work: WORK_MINUTES * 60,
  "short-break": SHORT_BREAK_MINUTES * 60,
  "long-break": LONG_BREAK_MINUTES * 60,
};

const PHASE_LABELS: Record<Phase, string> = {
  work: "Focus Session",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const resolveNextPhase = ({
  currentPhase,
  completedCount,
  creditFocus,
}: {
  currentPhase: Phase;
  completedCount: number;
  creditFocus: boolean;
}) => {
  if (currentPhase === "work") {
    const nextCompletedCount = creditFocus
      ? completedCount + 1
      : completedCount;

    const shouldTakeLongBreak =
      creditFocus && nextCompletedCount !== 0 && nextCompletedCount % 4 === 0;

    const nextPhase: Phase = shouldTakeLongBreak ? "long-break" : "short-break";
    const nextSeconds = shouldTakeLongBreak
      ? PHASE_DURATION_SECONDS["long-break"]
      : PHASE_DURATION_SECONDS["short-break"];

    return {
      nextPhase,
      nextSeconds,
      nextCompletedCount,
    };
  }

  return {
    nextPhase: "work" as const,
    nextSeconds: PHASE_DURATION_SECONDS.work,
    nextCompletedCount: completedCount,
  };
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(
    PHASE_DURATION_SECONDS.work
  );
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const transitionToNextPhase = useCallback(
    (options: { creditFocus?: boolean } = {}) => {
      const creditFocus = options.creditFocus ?? false;

      setCompletedPomodoros((count) => {
        const { nextPhase, nextSeconds, nextCompletedCount } = resolveNextPhase(
          {
            currentPhase: phase,
            completedCount: count,
            creditFocus,
          }
        );

        setPhase(nextPhase);
        setSecondsRemaining(nextSeconds);

        return nextCompletedCount;
      });
    },
    [phase]
  );

  useEffect(() => {
    if (!isRunning || secondsRemaining > 0) {
      return;
    }

    transitionToNextPhase({ creditFocus: phase === "work" });
  }, [isRunning, phase, secondsRemaining, transitionToNextPhase]);

  const cyclePosition = useMemo(() => {
    const completedInCycle = completedPomodoros % 4;

    if (phase === "work") {
      return completedInCycle + 1;
    }

    return completedInCycle === 0 ? 4 : completedInCycle;
  }, [completedPomodoros, phase]);

  const timerStatusLabel = isRunning ? "Running" : "Paused";

  const handleToggle = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(PHASE_DURATION_SECONDS[phase]);
    }
    setIsRunning((prev) => !prev);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setPhase("work");
    setSecondsRemaining(PHASE_DURATION_SECONDS.work);
    setCompletedPomodoros(0);
  };

  const handleSkip = () => {
    transitionToNextPhase();
  };

  const phaseLabel = PHASE_LABELS[phase];

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Card className="dark:bg-black relative w-full max-w-2xl">
        <div className="absolute left-6 right-6 top-6 flex justify-between">
          <Button variant="secondary" size="icon" aria-label="View rankings">
            <Trophy className="size-7" strokeWidth={2} />
          </Button>
          <Button variant="secondary" size="icon" aria-label="Open settings">
            <Settings className="size-7" strokeWidth={2} />
          </Button>
        </div>
        <CardHeader className="mt-16 items-center text-center">
          <CardTitle>{phaseLabel}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="flex w-full flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-neutral-950 dark:text-neutral-50 font-mono text-6xl font-bold md:text-7xl">
                {formatTime(secondsRemaining)}
              </p>
              <span className="text-lg font-semibold text-neutral-400">
                {cyclePosition} of 4 sessions
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="min-w-[160px] gap-2 font-semibold"
                onClick={handleToggle}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              {phase === "work" ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="min-w-[160px] gap-2 font-semibold"
                  onClick={handleRestart}
                >
                  Restart
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="min-w-[160px] gap-2 font-semibold"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              )}
            </div>
          </div>
          <div className="sr-only" aria-live="polite">
            {timerStatusLabel} – {phaseLabel}
          </div>
        </CardContent>
        <CardFooter className="hidden" />
      </Card>
    </main>
  );
}
