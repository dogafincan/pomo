"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "@/components/animate-ui/primitives/buttons/button";
import { cn } from "@/lib/utils";

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
  }
);

type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
