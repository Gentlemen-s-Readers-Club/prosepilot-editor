import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 font-copy",
  {
    variants: {
      variant: {
        default: "border border-brand-primary bg-brand-primary text-white hover:bg-transparent hover:text-brand-primary",
        destructive:
          "bg-state-error text-white hover:bg-state-error/90",
        outline:
          "border text-brand-primary border-brand-primary bg-transparent shadow-sm hover:bg-brand-primary hover:text-white",
        secondaryOutline:
          "border text-brand-secondary border-brand-secondary bg-transparent shadow-sm hover:bg-brand-secondary hover:text-brand-primary",
        secondary:
          "bg-brand-secondary text-brand-primary border border-brand-secondary shadow-sm hover:bg-transparent",
        ghost: "hover:bg-brand-primary/10 hover:text-base-heading",
        link: "text-base-heading underline-offset-4 hover:underline !p-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };