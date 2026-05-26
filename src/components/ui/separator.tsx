import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator: React.FC<SeparatorProps> = ({
  className = "",
  orientation = "horizontal",
  ...props
}) => {
  return (
    <div
      className={`bg-border-sutil shrink-0 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
      {...props}
    />
  );
};
