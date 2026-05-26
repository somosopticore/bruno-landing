import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  isMono?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error = false, isMono = false, ...props }, ref) => {
    const baseStyles =
      "flex w-full rounded-lg border bg-bg-primary px-3.5 py-3 text-sm text-text-primario placeholder-text-muted transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y";

    const fontStyle = isMono ? "font-mono" : "font-sans";

    const borders = error
      ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
      : "border-border-sutil focus:border-acento-primario focus:ring-2 focus:ring-acento-primario/20 focus:ring-offset-0";

    return (
      <textarea
        className={`${baseStyles} ${borders} ${fontStyle} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
