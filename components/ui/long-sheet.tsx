"use client";

import { Scroll, Sheet } from "@silk-hq/components";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import "./long-sheet.css";

type LongSheetContextValue = {
  setTrack: (track: "top" | "bottom") => void;
  restingOutside: boolean;
};

const LongSheetContext = createContext<LongSheetContextValue | null>(null);

type SheetRootProps = React.ComponentPropsWithoutRef<typeof Sheet.Root>;
type LongSheetRootProps = Omit<SheetRootProps, "license"> & {
  license?: SheetRootProps["license"];
};

const LongSheetRoot = forwardRef<
  React.ElementRef<typeof Sheet.Root>,
  LongSheetRootProps
>(({ license = "non-commercial", children, ...rest }, ref) => {
  return (
    <Sheet.Root license={license} ref={ref} {...rest}>
      {children}
    </Sheet.Root>
  );
});

LongSheetRoot.displayName = "LongSheet.Root";

const LongSheetView = forwardRef<
  React.ElementRef<typeof Sheet.View>,
  React.ComponentPropsWithoutRef<typeof Sheet.View>
>(({ children, className, onTravelStatusChange, ...rest }, ref) => {
  const [restingOutside, setRestingOutside] = useState(false);
  const [track, setTrack] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (restingOutside) {
      setTrack("bottom");
    }
  }, [restingOutside]);

  return (
    <LongSheetContext.Provider value={{ setTrack, restingOutside }}>
      <Sheet.View
        ref={ref}
        className={["LongSheet-view", className].filter(Boolean).join(" ")}
        contentPlacement="center"
        tracks={track}
        swipeOvershoot={false}
        nativeEdgeSwipePrevention={true}
        enteringAnimationSettings={{
          easing: "spring",
          stiffness: 480,
          damping: 45,
          mass: 1.5,
        }}
        onTravelStatusChange={(status) => {
          setRestingOutside(status === "idleOutside");
          onTravelStatusChange?.(status);
        }}
        {...rest}
      >
        {children}
      </Sheet.View>
    </LongSheetContext.Provider>
  );
});

LongSheetView.displayName = "LongSheet.View";

const LongSheetBackdrop = forwardRef<
  React.ElementRef<typeof Sheet.Backdrop>,
  React.ComponentPropsWithoutRef<typeof Sheet.Backdrop>
>(({ className, ...rest }, ref) => (
  <Sheet.Backdrop
    ref={ref}
    className={["LongSheet-backdrop", className].filter(Boolean).join(" ")}
    themeColorDimming="auto"
    {...rest}
  />
));

LongSheetBackdrop.displayName = "LongSheet.Backdrop";

const LongSheetContent = forwardRef<
  React.ElementRef<typeof Sheet.Content>,
  React.ComponentPropsWithoutRef<typeof Sheet.Content>
>(({ children, className, ...rest }, ref) => {
  const context = useContext(LongSheetContext);

  if (!context) {
    throw new Error("LongSheet.Content must be used within LongSheet.Root");
  }

  const { setTrack, restingOutside } = context;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(
    ({ progress }: { progress: number }) => {
      if (restingOutside) {
        return;
      }
      setTrack(progress < 0.5 ? "bottom" : "top");
    },
    [restingOutside, setTrack],
  );

  return (
    <Sheet.Content
      ref={ref}
      className={["LongSheet-content", className].filter(Boolean).join(" ")}
      asChild
      {...rest}
    >
      <Scroll.Root
        asChild
        className="LongSheet-scrollRoot"
        componentRef={scrollRef}
      >
        <Scroll.View className="LongSheet-scrollView" onScroll={handleScroll}>
          <Scroll.Content className="LongSheet-scrollContent">
            <div className="LongSheet-innerContent">{children}</div>
          </Scroll.Content>
        </Scroll.View>
      </Scroll.Root>
    </Sheet.Content>
  );
});

LongSheetContent.displayName = "LongSheet.Content";

const LongSheetPortal = Sheet.Portal;
const LongSheetTrigger = Sheet.Trigger;
const LongSheetHandle = Sheet.Handle;
const LongSheetOutlet = Sheet.Outlet;
const LongSheetTitle = Sheet.Title;
const LongSheetDescription = Sheet.Description;

export const LongSheet = {
  Root: LongSheetRoot,
  Portal: LongSheetPortal,
  View: LongSheetView,
  Backdrop: LongSheetBackdrop,
  Content: LongSheetContent,
  Trigger: LongSheetTrigger,
  Handle: LongSheetHandle,
  Outlet: LongSheetOutlet,
  Title: LongSheetTitle,
  Description: LongSheetDescription,
};
