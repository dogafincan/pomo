import { Trophy, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LongSheet } from "@/components/ui/long-sheet";

const RankingsBottomSheet = () => {
  const [presented, setPresented] = useState(false);

  return (
    <LongSheet.Root presented={presented} onPresentedChange={setPresented}>
      <LongSheet.Trigger asChild>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Open rankings"
          whileHover={presented ? { scale: 1 } : undefined}
        >
          <Trophy className="size-7" strokeWidth={2} />
        </Button>
      </LongSheet.Trigger>
      <LongSheet.Portal>
        <LongSheet.View>
          <LongSheet.Backdrop />
          <LongSheet.Content>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="icon"
                aria-label="Close rankings"
                onClick={() => setPresented(false)}
              >
                <X className="size-6" strokeWidth={2.75} />
              </Button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-3xl font-semibold">
              Coming soon... 👀
            </div>
          </LongSheet.Content>
        </LongSheet.View>
      </LongSheet.Portal>
    </LongSheet.Root>
  );
};

export { RankingsBottomSheet };
