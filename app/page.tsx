"use client";

import { RotateCcw, Settings, SkipForward, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePomodoroTimer } from "@/hooks/use-pomodoro-timer";
import { formatTime } from "@/lib/pomodoro";

export default function Home() {
  const {
    cyclePosition,
    handleRestart,
    handleSkip,
    handleToggle,
    isRunning,
    phase,
    phaseLabel,
    secondsRemaining,
    timerStatusLabel,
  } = usePomodoroTimer();

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Card className="relative flex-1 min-h-screen w-full gap-0 dark:bg-black justify-between">
        <CardHeader className="absolute left-6 right-6 top-6 grid grid-cols-[auto_auto] items-center gap-0 px-0 py-0">
          <Button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            variant="secondary"
            size="icon"
            aria-label="View rankings"
          >
            <Trophy className="size-7" strokeWidth={2} />
          </Button>
          <Button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            variant="secondary"
            size="icon"
            aria-label="Open settings"
          >
            <Settings className="size-7" strokeWidth={2} />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 pt-2">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <CardTitle>{phaseLabel}</CardTitle>
            <p className="text-neutral-950 dark:text-neutral-50 font-mono text-6xl font-bold">
              {formatTime(secondsRemaining)}
            </p>
            <span className="text-lg font-semibold text-neutral-400">
              {cyclePosition} of 4 sessions
            </span>
          </div>
          <div className="sr-only" aria-live="polite">
            {timerStatusLabel} – {phaseLabel}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 pb-10">
          <Button onClick={handleToggle}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          {phase === "work" ? (
            <Button variant="secondary" onClick={handleRestart}>
              <RotateCcw
                className="size-4"
                aria-hidden="true"
                strokeWidth={2.75}
              />
              Restart
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleSkip}>
              <SkipForward
                className="size-4"
                aria-hidden="true"
                strokeWidth={2.75}
              />
              Skip
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
