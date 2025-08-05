import { Edges, FillStyle } from "@/constants/index";
import { Sloppiness } from "@/constants";
import { ToolType } from "./tools";

export type ShapeOptions = {
  fill?: string;
  fillStyle?: FillStyle;
  sloppiness?: Sloppiness;
  stroke?: string;
  strokeWidth?: number;
  strokeDashOffset?: number;
};

type Rectangle = ShapeOptions & {
  type: ToolType.Rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
  edgeType: Edges;
};

type Ellipse = ShapeOptions & {
  type: ToolType.Ellipse;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

type Diamond = ShapeOptions & {
  type: ToolType.Diamond;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

type Line = ShapeOptions & {
  type: ToolType.Line;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
export type Shape = Rectangle | Ellipse | Diamond | Line;
