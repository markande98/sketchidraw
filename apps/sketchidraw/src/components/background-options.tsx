"use client";

import {
  BACKGROUND_DARK_COLORS,
  BACKGROUND_LIGHT_COLORS,
} from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ColorToolTip } from "./color-tooltip";

type BackgroundOptionsProps = {
  selectedShapeIndex: number | null;
};

export const BackgroundOptions = ({
  selectedShapeIndex,
}: BackgroundOptionsProps) => {
  const { resolvedTheme } = useTheme();
  const { canvaBgColor, onSetCanvaBgColor, canvaShapes, onSetCanvaShapes } =
    useCanva();

  const onChange = (color: string | "transparent") => {
    onSetCanvaBgColor(color);
    if (selectedShapeIndex !== null) {
      const newShapes = canvaShapes;
      let shapeToUpdate = newShapes[selectedShapeIndex];
      shapeToUpdate = {
        ...shapeToUpdate,
        fill: color,
      };
      newShapes[selectedShapeIndex] = shapeToUpdate;
      onSetCanvaShapes([...newShapes]);
    }
  };

  const COLORS =
    resolvedTheme === "dark" ? BACKGROUND_DARK_COLORS : BACKGROUND_LIGHT_COLORS;

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-on-surface text-[11px] font-normal tracking-tigher">
        Background
      </h3>
      <div className="w-45">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {COLORS.map((color, index) => (
              <div
                key={index}
                className={cn(
                  "h-6 w-6 rounded-sm cursor-pointer opacity-50 hover:scale-100 transition duration-200",
                  color === canvaBgColor &&
                    "ring-1 border border-black ring-blue-400"
                )}
                style={
                  color === "transparent"
                    ? {
                        backgroundImage: "url('/background-transparent.png')",
                        backgroundColor: "white",
                      }
                    : {
                        backgroundColor: color,
                      }
                }
                // ...existing
                onClick={() => onChange(color)}
              />
            ))}
          </div>
          <div className="w-[1px] h-[20px] bg-surface-high/80" />
          <ColorToolTip isCanvaBg />
        </div>
      </div>
    </div>
  );
};
