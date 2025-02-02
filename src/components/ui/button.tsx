import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white text-base border-radius-lg text-base",
        disabled: "bg-gray-100 text-gray-300 cursor-not-allowed",
        ghost: "text-gray-200 text-[15px] cursor-not-allowed", // 임시저장
        ghost_disabled: "text-gray-700 text-[15px]",
        link: "text-primary underline-offset-4 hover:underline",
        card: "",
      },
      size: {
        sm: "h-[36px] w-[72px]",
        md: "h-[52px] w-[166px]",
        lg: "h-[52px] w-[343px]",
        icon_sm: "h-[14px] w-[14px]",
        icon_md: "h-[18px] w-[18px]",
        icon_lg: "h-[24px] w-[24px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
