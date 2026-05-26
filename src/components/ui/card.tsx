import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", glass = false, ...props }, ref) => {
    const cardBg = glass
      ? "bg-bg-card/75 backdrop-blur-md"
      : "bg-bg-card";
    
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-border-sutil shadow-xl ${cardBg} ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
