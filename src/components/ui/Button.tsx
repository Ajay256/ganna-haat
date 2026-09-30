"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[36px]",
      md: "px-4 py-2.5 text-sm gap-2 min-h-[44px]",
      lg: "px-6 py-3.5 text-base gap-2.5 min-h-[52px]",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-cane-700 to-cane-600 hover:from-cane-800 hover:to-cane-700 text-white shadow-xs hover:shadow-sm focus:ring-cane-600",
      secondary:
        "bg-jaggery-500 hover:bg-jaggery-600 text-white shadow-xs hover:shadow-sm focus:ring-jaggery-500",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-600",
      outline:
        "border-2 border-cane-300 hover:border-cane-600 bg-white text-cane-900 hover:bg-cane-50 focus:ring-cane-500",
      ghost:
        "text-cane-800 hover:bg-cane-100 hover:text-cane-950 focus:ring-cane-400",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>कृपया प्रतीक्षा करें...</span>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
