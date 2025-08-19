"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { Minus, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const MIN_ZOOM_VALUE = 0.05;
const MAX_ZOOM_VALUE = 2.0;
const RESET_ZOOM_VALUE = 1;

export const CanvaZoom = () => {
  const { canvasScale, onSetCanvasScale } = useCanva();

  const handleIncrease = () => {
    const value = Math.min(MAX_ZOOM_VALUE, canvasScale + 0.05);
    onSetCanvasScale(value);
  };

  const resetZoom = () => {
    onSetCanvasScale(RESET_ZOOM_VALUE);
  };

  const handleDecrease = () => {
    const value = Math.max(MIN_ZOOM_VALUE, canvasScale - 0.05);
    onSetCanvasScale(value);
  };

  const displayPercetage = (canvasScale * 100).toFixed(0);
  return (
    <div className="absolute z-[100] left-10 bottom-10 flex items-center gap-2 bg-surface-low rounded-md cursor-pointer">
      <button
        onClick={handleDecrease}
        disabled={canvasScale === MIN_ZOOM_VALUE}
        className="h-[40px] px-2 hover:bg-surface-high cursor-pointer flex items-center justify-center overflow-hidden rounded-l-md"
      >
        <Minus
          size={16}
          className={`${canvasScale === MIN_ZOOM_VALUE ? "text-gray-600" : "text-white"} transition-colors`}
        />
      </button>

      <Tooltip>
        <TooltipTrigger onClick={resetZoom} asChild>
          <div
            onClick={resetZoom}
            className="min-w-[60px] text-center py-2 px-2"
          >
            <span className="text-xs font-normal text-white tracking-wide">
              {displayPercetage}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-black text-white p-2"
          side="top"
          sideOffset={5}
        >
          <span className="font-semibold">Reset Zoom</span>
        </TooltipContent>
      </Tooltip>

      <button
        onClick={handleIncrease}
        disabled={canvasScale === MAX_ZOOM_VALUE}
        className="h-[40px] px-2 hover:bg-surface-high cursor-pointer flex items-center justify-center overflow-hidden rounded-r-md"
      >
        <Plus
          size={16}
          className={`${canvasScale >= MAX_ZOOM_VALUE ? "text-gray-600" : "text-white"} transition-colors`}
        />
      </button>
    </div>
  );
};
