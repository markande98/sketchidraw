"use client";

import { FontFamily as FONT_FAMILY } from "@/constants/index";
import {
  ComicShannsFontSvg,
  NunitoFontSvg,
  SketchiFontSvg,
} from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";

export const FontFamily = () => {
  const { canvaFontFamily, onSetCanvaFontFamily } = useCanva();

  const onClick = (font: FONT_FAMILY) => {
    onSetCanvaFontFamily(font);
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Font family
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(FONT_FAMILY.SketchiFont)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.SketchiFont &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <SketchiFontSvg />
          </div>
          <div
            onClick={() => onClick(FONT_FAMILY.Nunito)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.Nunito &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <NunitoFontSvg />
          </div>
          <div
            onClick={() => onClick(FONT_FAMILY.Comicshanns)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.Comicshanns &&
                "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <ComicShannsFontSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
