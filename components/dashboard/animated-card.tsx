"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
}

export function AnimatedCard({ children, className, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(className)} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}

