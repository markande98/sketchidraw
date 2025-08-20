import { create } from "zustand";

import { ToolType } from "@/types/tools";
import { RoughCanvas } from "roughjs/bin/canvas";
import {
  ArrowTypes,
  BACKGROUND_COLOR,
  CANVAS_BG_COLOR,
  CursorType,
  Edges,
  FillStyle,
  FontFamily,
  FontSize,
  Sloppiness,
  STROKE_COLORS,
  STROKE_DASH_OFFSET,
  STROKE_WIDTH,
} from "@/constants/index";
import { Shape } from "@/types/shape";

interface CanvaStore {
  canvas: HTMLCanvasElement | null;
  roughCanvas: RoughCanvas | null;
  themeColor: string;
  tooltype: ToolType;
  canvasScale: number;
  canvaCursorType: CursorType;
  canvaShapes: Shape[];
  canvaBgColor: string | "transparent";
  canvaStrokeColor: string;
  canvaStrokeWidth: number;
  canvaStrokeDashOffset: number;
  canvaFillstyle: FillStyle;
  canvaSloppiness: Sloppiness;
  canvaEdge: Edges;
  canvaArrowType: ArrowTypes;
  canvaFontSize: FontSize;
  canvaFontFamily: FontFamily;

  onSetCanva: (canvas: HTMLCanvasElement) => void;
  onSetThemeColor: (color: string) => void;
  onSelectTooltype: (tooltype: ToolType) => void;
  onSetCanvasScale: (scale: number) => void;
  onSetCanvaCursorType: (cursorType: CursorType) => void;
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => void;
  onSetCanvaShapes: (shapes: Shape[]) => void;
  onSetCanvaBgColor: (color: string) => void;
  onSetCanvaStrokeColor: (color: string) => void;
  onSetCanvaStrokeWidth: (width: number) => void;
  onSetCanvaStrokeDashOffset: (offset: number) => void;
  onSetCanvaFillstyle: (style: FillStyle) => void;
  onSetCanvaSloppiness: (sloppiness: Sloppiness) => void;
  onSetCanvaEdge: (edge: Edges) => void;
  onsetCanvaArrowType: (type: ArrowTypes) => void;
  onSetCanvaFontSize: (type: FontSize) => void;
  onSetCanvaFontFamily: (font: FontFamily) => void;
}

export const useCanva = create<CanvaStore>((set) => ({
  canvas: null,
  themeColor: CANVAS_BG_COLOR[0],
  roughCanvas: null,
  tooltype: ToolType.Select,
  canvasScale: 1,
  canvaCursorType: CursorType.Crosshair,
  canvaShapes: [],
  canvaBgColor: BACKGROUND_COLOR[0],
  canvaStrokeColor: STROKE_COLORS[0],
  canvaStrokeWidth: STROKE_WIDTH[0],
  canvaStrokeDashOffset: STROKE_DASH_OFFSET[0],
  canvaFillstyle: FillStyle.Hachure,
  canvaSloppiness: Sloppiness.Architect,
  canvaEdge: Edges.Sharp,
  canvaArrowType: ArrowTypes.Arrow,
  canvaFontSize: FontSize.Small,
  canvaFontFamily: FontFamily.SketchiFont,

  onSetCanva: (canvas: HTMLCanvasElement) => set({ canvas }),
  onSetThemeColor: (color: string) => set({ themeColor: color }),
  onSetRoughCanvas: (roughCanvas: RoughCanvas) => set({ roughCanvas }),
  onSetCanvasScale: (scale: number) => set({ canvasScale: scale }),
  onSelectTooltype: (tooltype: ToolType) => set({ tooltype }),
  onSetCanvaCursorType: (cursorType: CursorType) =>
    set({ canvaCursorType: cursorType }),
  onSetCanvaShapes: (shapes: Shape[]) => set({ canvaShapes: shapes }),
  onSetCanvaBgColor: (color: string) => set({ canvaBgColor: color }),
  onSetCanvaStrokeColor: (color: string) => set({ canvaStrokeColor: color }),
  onSetCanvaStrokeWidth: (width: number) => set({ canvaStrokeWidth: width }),
  onSetCanvaStrokeDashOffset: (offset: number) =>
    set({ canvaStrokeDashOffset: offset }),
  onSetCanvaFillstyle: (style: FillStyle) => set({ canvaFillstyle: style }),
  onSetCanvaSloppiness: (sloppiness: Sloppiness) =>
    set({ canvaSloppiness: sloppiness }),
  onSetCanvaEdge: (edge: Edges) => set({ canvaEdge: edge }),
  onsetCanvaArrowType: (type: ArrowTypes) => set({ canvaArrowType: type }),
  onSetCanvaFontSize: (type: FontSize) => set({ canvaFontSize: type }),
  onSetCanvaFontFamily: (font: FontFamily) => set({ canvaFontFamily: font }),
}));
