import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "success" | "ghost";
  size?: "default" | "sm";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "default" && "px-4 py-2",
          {
            "bg-primary text-primary-foreground hover:opacity-90": variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "bg-destructive text-destructive-foreground hover:opacity-90": variant === "destructive",
            "border-2 border-border bg-transparent hover:bg-muted": variant === "outline",
            "bg-success text-success-foreground hover:opacity-90": variant === "success",
            "bg-transparent hover:bg-muted": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
