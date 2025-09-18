"use client";

import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Phase = "work" | "break";

type Durations = Record<Phase, number>;

const DEFAULT_DURATIONS: Durations = {
  work: 25,
  break: 5,
};

const MINUTES_LIMIT = {
  min: 1,
  max: 180,
} as const;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export default function Home() {
  const [durations, setDurations] = useState<Durations>({
    ...DEFAULT_DURATIONS,
  });
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(durations.work * 60);
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

  useEffect(() => {
    if (!isRunning || secondsRemaining > 0) {
      return;
    }

    setPhase((currentPhase) => {
      const nextPhase: Phase = currentPhase === "work" ? "break" : "work";
      const nextDuration = durations[nextPhase] * 60;

      if (currentPhase === "work") {
        setCompletedPomodoros((count) => count + 1);
      }

      setSecondsRemaining(nextDuration);
      return nextPhase;
    });
  }, [durations, isRunning, secondsRemaining]);

  const totalSeconds = useMemo(() => durations[phase] * 60, [durations, phase]);
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
      setSecondsRemaining(durations[phase] * 60);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("work");
    setSecondsRemaining(durations.work * 60);
    setCompletedPomodoros(0);
  };

  const handleSkip = () => {
    setPhase((currentPhase) => {
      const nextPhase: Phase = currentPhase === "work" ? "break" : "work";
      setSecondsRemaining(durations[nextPhase] * 60);
      return nextPhase;
    });
  };

  const handleDurationChange = (
    target: Phase,
    rawValue: string,
    options: { syncActivePhase?: boolean } = {},
  ) => {
    const numericValue = Number(rawValue);
    const sanitized = Number.isFinite(numericValue)
      ? Math.max(
          MINUTES_LIMIT.min,
          Math.min(MINUTES_LIMIT.max, Math.floor(numericValue)),
        )
      : MINUTES_LIMIT.min;

    setDurations((prev) => {
      if (prev[target] === sanitized) {
        return prev;
      }
      return { ...prev, [target]: sanitized };
    });

    if (options.syncActivePhase && target === phase) {
      setSecondsRemaining(sanitized * 60);
    }
  };

  const handleRestoreDefaults = () => {
    setIsRunning(false);
    setPhase("work");
    setDurations({ ...DEFAULT_DURATIONS });
    setSecondsRemaining(DEFAULT_DURATIONS.work * 60);
    setCompletedPomodoros(0);
  };

  const phaseLabel = phase === "work" ? "Focus" : "Break";

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>
              Alternate between focused work sessions and refreshing breaks.
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

        <Card>
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
            <CardDescription>
              Adjust durations in minutes. Changes pause the timer
              automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="focus-length">Focus length</Label>
              <Input
                id="focus-length"
                type="number"
                min={MINUTES_LIMIT.min}
                max={MINUTES_LIMIT.max}
                value={durations.work}
                onChange={(event) => {
                  setIsRunning(false);
                  handleDurationChange("work", event.target.value, {
                    syncActivePhase: true,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-length">Break length</Label>
              <Input
                id="break-length"
                type="number"
                min={MINUTES_LIMIT.min}
                max={MINUTES_LIMIT.max}
                value={durations.break}
                onChange={(event) => {
                  setIsRunning(false);
                  handleDurationChange("break", event.target.value, {
                    syncActivePhase: true,
                  });
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Range: {MINUTES_LIMIT.min}–{MINUTES_LIMIT.max} minutes
            </span>
            <Button
              variant="ghost"
              onClick={handleRestoreDefaults}
              disabled={
                durations.work === DEFAULT_DURATIONS.work &&
                durations.break === DEFAULT_DURATIONS.break
              }
            >
              Restore defaults
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
