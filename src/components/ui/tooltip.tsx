"use client";

import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border-sutil bg-bg-card p-3 text-xs text-text-secundario shadow-2xl">
          <div className="relative z-10 font-sans leading-relaxed">{content}</div>
          <div className="absolute top-full left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1.5 rotate-45 border-r border-b border-border-sutil bg-bg-card" />
        </div>
      )}
    </div>
  );
};
