import { Sheet } from "@silk-hq/components";
import "./bottom-sheet.css";

const BottomSheet = () => (
  <Sheet.Root license="non-commercial">
    <Sheet.Trigger>Open</Sheet.Trigger>
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

export { BottomSheet };
