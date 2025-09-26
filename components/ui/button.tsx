import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type MotionProps, motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const MotionSlot = motion(Slot);

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-2xl text-lg font-semibold",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-950 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950",
        secondary:
          "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
      },
      size: {
        default: "h-12 w-50",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> &
  MotionProps & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      whileHover,
      whileTap,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? MotionSlot : motion.button;
    const hoverAnimation = whileHover ?? { scale: 1.1 };
    const tapAnimation = whileTap ?? { scale: 0.95 };

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
