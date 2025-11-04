"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LightningIcon } from "./lightning-icon";

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  text?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 72,
};

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    { size = "md", withText = false, text = "Loading...", className, ...props },
    ref
  ) => {
    const iconSize = sizeMap[size];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className
        )}
        {...props}
      >
        <div className="rounded-full p-6 bg-card border">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <LightningIcon
              size={iconSize}
              animated={true}
              glowing={true}
              className="text-lightning-blue"
            />
          </motion.div>
        </div>

        {withText && (
          <motion.p
            className="text-muted-foreground text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
