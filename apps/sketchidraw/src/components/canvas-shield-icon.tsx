"use client";

import { ShieldCheckSvg } from "@/constants/svg";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const CanvasShieldIcon = () => {
  return (
    <Tooltip>
      <TooltipTrigger className="hidden sm:block absolute z-[100] bottom-6 right-6">
        <ShieldCheckSvg />
      </TooltipTrigger>
      <TooltipContent
        className="bg-black text-white"
        side="top"
        sideOffset={10}
      >
        <span className="font-semibold font-sketchifont p-1">
          Your drawings are end-to-end encrypted so Sketchidraw&apos;s server
          will never see them.
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
