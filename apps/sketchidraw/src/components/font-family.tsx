"use client";

import { FontFamily as FONT_FAMILY } from "@/constants/index";
import {
  ComicShannsFontSvg,
  NunitoFontSvg,
  SketchiFontSvg,
} from "@/constants/svg";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { ToolType } from "@/types/tools";

type FontFamilyProps = {
  selectedShapeIndex: number | null;
};

export const FontFamily = ({ selectedShapeIndex }: FontFamilyProps) => {
  const {
    canvaFontFamily,
    canvaShapes,
    onSetCanvaFontFamily,
    onSetCanvaShapes,
  } = useCanva();

  const onClick = (font: FONT_FAMILY) => {
    onSetCanvaFontFamily(font);
    if (selectedShapeIndex !== null) {
      const newShapes = canvaShapes;
      let shapeToUpdate = newShapes[selectedShapeIndex];
      if (shapeToUpdate.type === ToolType.Text) {
        shapeToUpdate = {
          ...shapeToUpdate,
          fontFamily: font,
        };
      }
      newShapes[selectedShapeIndex] = shapeToUpdate;
      onSetCanvaShapes([...newShapes]);
    }
  };
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Font family
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            tabIndex={0}
            onClick={(e) => {
              e.currentTarget.focus();
              onClick(FONT_FAMILY.SketchiFont);
            }}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.SketchiFont &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <SketchiFontSvg />
          </div>
          <div
            tabIndex={0}
            onClick={() => onClick(FONT_FAMILY.Nunito)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.Nunito &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <NunitoFontSvg />
          </div>
          <div
            tabIndex={0}
            onClick={() => onClick(FONT_FAMILY.Comicshanns)}
            className={cn(
              "flex items-center justify-center h-8 w-8 border-default-border-color bg-button-bg focus:ring-1 focus:ring-brand-hover rounded-sm cursor-pointer transition duration-100",
              canvaFontFamily === FONT_FAMILY.Comicshanns &&
                "bg-surface-primary-container border-surface-primary-container"
            )}
          >
            <ComicShannsFontSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
