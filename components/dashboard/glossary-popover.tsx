"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlossaryPopoverProps {
  term: string;
  definition: string;
  trigger?: React.ReactNode;
}

export function GlossaryPopover({
  term,
  definition,
  trigger,
}: GlossaryPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Info className="h-4 w-4" />
            <span className="sr-only">Info about {term}</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{term}</h4>
          <p className="text-sm text-muted-foreground">{definition}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
