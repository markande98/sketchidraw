"use client";

import { useCanva } from "@/hooks/use-canva-store";
import { Sloppiness as SLOPPINESS } from "@/constants/index";
import { ArchitectSvg, ArtistSvg, CartoonistSvg } from "@/constants/svg";
import { cn } from "@/lib/utils";

export const Sloppiness = () => {
  const { canvaSloppiness, onSetCanvaSloppiness } = useCanva();

  const onClick = (sloppiness: SLOPPINESS) => {
    onSetCanvaSloppiness(sloppiness);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Sloppiness
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(SLOPPINESS.Architect)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Architect &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <ArchitectSvg />
          </div>
          <div
            onClick={() => onClick(SLOPPINESS.Artist)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Artist &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <ArtistSvg />
          </div>
          <div
            onClick={() => onClick(SLOPPINESS.Cartoonist)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaSloppiness === SLOPPINESS.Cartoonist &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <CartoonistSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
