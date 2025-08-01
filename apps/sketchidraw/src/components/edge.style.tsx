"use client";

import { Edges } from "@/constants";
import { RoundEdgeSvg, SharpEdgeSvg } from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";

export const EdgeStyle = () => {
  const { canvaEdge, onSetCanvaEdge } = useCanva();
  const onClick = (edge: Edges) => {
    onSetCanvaEdge(edge);
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Edges
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(Edges.Sharp)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaEdge === Edges.Sharp && "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <SharpEdgeSvg />
          </div>
          <div
            onClick={() => onClick(Edges.Round)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaEdge === Edges.Round && "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <RoundEdgeSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
