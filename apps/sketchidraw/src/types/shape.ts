import { ArrowTypes, Edges, FillStyle } from "@/constants/index";
import { Sloppiness } from "@/constants";
import { ToolType } from "./tools";

export type ShapeOptions = {
  fill?: string;
  fillStyle?: FillStyle;
  sloppiness?: Sloppiness;
  stroke?: string;
  strokeWidth?: number;
  strokeDashOffset?: number;
  hachureAngle?: number;
  hachureGap?: number;
  fillWeight?: number;
  seed?: number;
};

type Rectangle = ShapeOptions & {
  type: ToolType.Rectangle;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  edgeType: Edges;
};

type Ellipse = ShapeOptions & {
  type: ToolType.Ellipse;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Diamond = ShapeOptions & {
  type: ToolType.Diamond;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Line = ShapeOptions & {
  type: ToolType.Line;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  sX: number;
  sY: number;
  mX: number;
  mY: number;
  eX: number;
  eY: number;
};

type Arrow = ShapeOptions & {
  type: ToolType.Arrow;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  sX: number;
  sY: number;
  mX: number;
  mY: number;
  eX: number;
  eY: number;
  arrowType: ArrowTypes;
};

type Pencil = ShapeOptions & {
  type: ToolType.Pencil;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  points: [x: number, y: number][];
};

export type Text = {
  type: ToolType.Text;
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  lineHeight: number;
};

export type Shape = Rectangle | Ellipse | Diamond | Line | Arrow | Pencil;
