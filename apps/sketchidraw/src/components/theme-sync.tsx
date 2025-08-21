// components/ThemeSync.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  BACKGROUND_DARK_COLORS,
  BACKGROUND_LIGHT_COLORS,
  CANVAS_BG_DARK_COLOR,
  CANVAS_BG_LIGHT_COLOR,
  STROKE_DARK_COLORS,
  STROKE_LIGHT_COLORS,
} from "@/constants/index";
import { useCanva } from "@/hooks/use-canva-store";

export function ThemeSync() {
  const { resolvedTheme } = useTheme();
  const { onSetThemeColor, onSetCanvaStrokeColor, onSetCanvaBgColor } =
    useCanva();

  useEffect(() => {
    if (resolvedTheme === "dark") {
      onSetThemeColor(CANVAS_BG_DARK_COLOR[0]);
      onSetCanvaStrokeColor(STROKE_DARK_COLORS[0]);
      onSetCanvaBgColor(BACKGROUND_DARK_COLORS[0]);
    } else {
      onSetThemeColor(CANVAS_BG_LIGHT_COLOR[0]);
      onSetCanvaStrokeColor(STROKE_LIGHT_COLORS[0]);
      onSetCanvaBgColor(BACKGROUND_LIGHT_COLORS[0]);
    }
  }, [
    resolvedTheme,
    onSetThemeColor,
    onSetCanvaStrokeColor,
    onSetCanvaBgColor,
  ]);

  return null;
}
