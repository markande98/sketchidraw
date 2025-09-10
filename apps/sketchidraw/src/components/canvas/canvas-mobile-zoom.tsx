"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { Minus, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

const MIN_ZOOM_VALUE = 0.05;
const MAX_ZOOM_VALUE = 2.0;

type CanvasZoomProps = {
  zoomIn: (factor: number) => void;
  zoomOut: (factor: number) => void;
  resetZoom: () => void;
};

export const CanvasMobileZoom = ({
  zoomIn,
  zoomOut,
  resetZoom,
}: CanvasZoomProps) => {
  const { canvasScale } = useCanva();

  const displayPercetage = (canvasScale * 100).toFixed(0);
  return (
    <div className="flex w-34 sm:hidden items-center justify-between gap-2 bg-surface-low rounded-md cursor-pointer border px-1">
      <Button
        variant="outline"
        onClick={() => zoomOut(0.9)}
        disabled={canvasScale === MIN_ZOOM_VALUE}
        className="h-8 w-8 px-2 hover:bg-surface-high cursor-pointer flex items-center justify-center overflow-hidden rounded-l-md"
      >
        <Minus
          size={16}
          className={`${canvasScale === MIN_ZOOM_VALUE ? "text-on-surface/30" : "text-on-surface"} transition-colors`}
        />
      </Button>

      <Tooltip>
        <TooltipTrigger onClick={resetZoom} asChild>
          <div className="min-w-[30px] text-center py-2 px-2">
            <span className="text-xs font-normal text-on-surface tracking-wide">
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

      <Button
        variant="outline"
        onClick={() => zoomIn(1.1)}
        disabled={canvasScale === MAX_ZOOM_VALUE}
        className="h-8 w-8 px-2 hover:bg-surface-high cursor-pointer flex items-center justify-center overflow-hidden rounded-r-md"
      >
        <Plus
          size={16}
          className={`${canvasScale >= MAX_ZOOM_VALUE ? "text-on-surface/30" : "text-on-surface"} transition-colors`}
        />
      </Button>
    </div>
  );
};
