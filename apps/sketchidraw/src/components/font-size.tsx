"use client";

import {
  FontExtraLargeSvg,
  FontLargeSvg,
  FontMediumSvg,
  FontSmallSvg,
} from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { FontSize as FONT_SIZE } from "@/constants/index";
import { cn } from "@/lib/utils";

export const FontSize = () => {
  const { canvaFontSize, onSetCanvaFontSize } = useCanva();

  const onClick = (fontSize: FONT_SIZE) => {
    onSetCanvaFontSize(fontSize);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Font size
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onClick(FONT_SIZE.Small)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Small &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontSmallSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Medium)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Medium &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontMediumSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Large)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Large &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontLargeSvg />
          </div>
          <div
            onClick={() => onClick(FONT_SIZE.Extralarge)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg rounded-sm cursor-pointer transition duration-100",
              canvaFontSize === FONT_SIZE.Extralarge &&
                "ring-1 ring-brand-hover bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <FontExtraLargeSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
