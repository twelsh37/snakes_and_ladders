import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "success";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg px-4 py-2 font-medium transition-colors",
          {
            "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200":
              variant === "secondary",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "border-2 border-gray-200 hover:bg-gray-50": variant === "outline",
            "bg-green-500 text-white hover:bg-green-600": variant === "success",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
