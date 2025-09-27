import { Settings } from "lucide-react";
import "./settings-bottom-sheet.css";
import { Sheet } from "@silk-hq/components";

import { Button } from "@/components/ui/button";

const SettingsBottomSheet = () => (
  <Sheet.Root license="non-commercial">
    <Sheet.Trigger asChild>
      <Button variant="secondary" size="icon" aria-label="Open settings">
        <Settings className="size-7" strokeWidth={2} />
      </Button>
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

export { SettingsBottomSheet };
