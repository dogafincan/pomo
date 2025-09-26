export type Phase = "work" | "short-break" | "long-break";

type ResolveNextPhaseArgs = {
  currentPhase: Phase;
  completedCount: number;
  creditFocus: boolean;
};

type ResolveNextPhaseResult = {
  nextPhase: Phase;
  nextSeconds: number;
  nextCompletedCount: number;
};

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

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function resolveNextPhase({
  currentPhase,
  completedCount,
  creditFocus,
}: ResolveNextPhaseArgs): ResolveNextPhaseResult {
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
    nextPhase: "work",
    nextSeconds: PHASE_DURATION_SECONDS.work,
    nextCompletedCount: completedCount,
  };
}

function getCyclePosition(phase: Phase, completedPomodoros: number) {
  const completedInCycle = completedPomodoros % 4;

  if (phase === "work") {
    return completedInCycle + 1;
  }

  return completedInCycle === 0 ? 4 : completedInCycle;
}

export {
  formatTime,
  getCyclePosition,
  PHASE_DURATION_SECONDS,
  PHASE_LABELS,
  resolveNextPhase,
};
