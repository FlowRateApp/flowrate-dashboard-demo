"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LightningIconProps {
  size?: number;
  animated?: boolean;
  glowing?: boolean;
  className?: string;
}

const LightningIcon = React.forwardRef<SVGSVGElement, LightningIconProps>(
  ({ size = 24, animated = true, glowing = false, className }, ref) => {
    const pulseAnimation = {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
    };

    if (animated) {
      return (
        <motion.svg
          ref={ref}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "inline-block",
            glowing && "drop-shadow-glow",
            className
          )}
          animate={pulseAnimation}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
            fill="currentColor"
            className="text-lightning-blue"
          />
          <path
            d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-lightning-blue"
          />
        </motion.svg>
      );
    }

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("inline-block", glowing && "drop-shadow-glow", className)}
      >
        <path
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
          fill="currentColor"
          className="text-lightning-blue"
        />
        <path
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-lightning-blue"
        />
      </svg>
    );
  }
);

LightningIcon.displayName = "LightningIcon";

export { LightningIcon };
