import { Trophy } from "lucide-react";
import "./rankings-bottom-sheet.css";
import { Sheet } from "@silk-hq/components";

const RankingsBottomSheet = () => (
  <Sheet.Root license="non-commercial">
    <Sheet.Trigger className="inline-flex items-center justify-center rounded-2xl text-lg font-medium size-12 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Trophy className="size-7" strokeWidth={2} />
    </Sheet.Trigger>
    <Sheet.Portal>
      <Sheet.View className="BottomSheet-view" nativeEdgeSwipePrevention={true}>
        <Sheet.Backdrop themeColorDimming="auto" />
        <Sheet.Content className="BottomSheet-content text-3xl font-semibold">
          <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          Coming soon... 👀
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Portal>
  </Sheet.Root>
);

export { RankingsBottomSheet };
