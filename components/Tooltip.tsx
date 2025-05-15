"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export interface Item {
  id: number;
  name: string;
//   designation: string;
  image: string;
}

interface AnimatedTooltipPreviewProps {
  items: Item[];
}

export function AnimatedTooltipPreview({ items }: AnimatedTooltipPreviewProps) {
  return (
    <div className="flex flex-row items-center mb-10 w-full">
      <AnimatedTooltip items={items} />
    </div>
  );
}
