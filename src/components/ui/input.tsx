import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", error = false, success = false, ...props }, ref) => {
    const baseStyles =
      "flex h-11 w-full rounded-lg border bg-bg-primary px-3.5 py-2 text-sm text-text-primario placeholder-text-muted transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const borders = error
      ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
      : success
      ? "border-success focus:border-success focus:ring-2 focus:ring-success/20"
      : "border-border-sutil focus:border-acento-primario focus:ring-2 focus:ring-acento-primario/20 focus:ring-offset-0";

    return (
      <input
        type={type}
        className={`${baseStyles} ${borders} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
