import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getCyclePosition,
  PHASE_DURATION_SECONDS,
  PHASE_LABELS,
  type Phase,
  resolveNextPhase,
} from "@/lib/pomodoro";

function usePomodoroTimer() {
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

  const cyclePosition = useMemo(
    () => getCyclePosition(phase, completedPomodoros),
    [completedPomodoros, phase],
  );

  const handleToggle = useCallback(() => {
    setSecondsRemaining((prev) => {
      if (prev === 0) {
        return PHASE_DURATION_SECONDS[phase];
      }
      return prev;
    });
    setIsRunning((prev) => !prev);
  }, [phase]);

  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setPhase("work");
    setSecondsRemaining(PHASE_DURATION_SECONDS.work);
    setCompletedPomodoros(0);
  }, []);

  const handleSkip = useCallback(() => {
    transitionToNextPhase();
  }, [transitionToNextPhase]);

  const phaseLabel = PHASE_LABELS[phase];
  const timerStatusLabel = isRunning ? "Running" : "Paused";

  return {
    cyclePosition,
    handleRestart,
    handleSkip,
    handleToggle,
    isRunning,
    phase,
    phaseLabel,
    secondsRemaining,
    timerStatusLabel,
  };
}

export { usePomodoroTimer };
