"use client";

import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  work: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
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
    PHASE_DURATION_SECONDS.work,
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
          },
        );

        setPhase(nextPhase);
        setSecondsRemaining(nextSeconds);

        return nextCompletedCount;
      });
    },
    [phase],
  );

  useEffect(() => {
    if (!isRunning || secondsRemaining > 0) {
      return;
    }

    transitionToNextPhase({ creditFocus: phase === "work" });
  }, [isRunning, phase, secondsRemaining, transitionToNextPhase]);

  const totalSeconds = useMemo(() => PHASE_DURATION_SECONDS[phase], [phase]);
  const progress = useMemo(() => {
    if (totalSeconds === 0) {
      return 0;
    }

    const elapsed = totalSeconds - secondsRemaining;
    return Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalSeconds) * 100)),
    );
  }, [totalSeconds, secondsRemaining]);

  const handleToggle = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(PHASE_DURATION_SECONDS[phase]);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
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
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            Track four-focus cycles with short breaks and a long reset every
            fourth pomodoro.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {phaseLabel} session
            </span>
            <p className="font-mono text-6xl md:text-7xl">
              {formatTime(secondsRemaining)}
            </p>
            <span className="text-xs text-muted-foreground">
              {isRunning ? "Timer running" : "Timer paused"}
            </span>
          </div>
          <div className="flex w-full items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleToggle}>
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="ghost" onClick={handleSkip}>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Completed focus rounds:{" "}
            <span className="font-semibold text-foreground">
              {completedPomodoros}
            </span>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
