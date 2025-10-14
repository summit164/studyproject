"use client";
import React from "react";
import { cn } from "@/lib/utils";

type TextShimmerProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number; // seconds
};

export function TextShimmer({ children, className, duration = 1.5 }: TextShimmerProps) {
  return (
    <span className={cn("inline-block", className)}>
      <style jsx>{`
        .text-shimmer {
          background-image: linear-gradient(
            90deg,
            var(--base-color, #111) 25%,
            var(--base-gradient-color, #aaa) 50%,
            var(--base-color, #111) 75%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer ${duration}s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      <span className="text-shimmer">{children}</span>
    </span>
  );
}

export default TextShimmer;