import { ArrowTypes, Edges, FillStyle } from "@/constants/index";
import { Sloppiness } from "@/constants";
import { ToolType } from "./tools";

export type ShapeOptions = {
  isDeleted: boolean;
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
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  edgeType: Edges;
};

type Ellipse = ShapeOptions & {
  type: ToolType.Ellipse;
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Diamond = ShapeOptions & {
  type: ToolType.Diamond;
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  edgeType: Edges;
};

type Line = ShapeOptions & {
  type: ToolType.Line;
  id: string;
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
  id: string;
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
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  points: [x: number, y: number][];
};

export type Text = ShapeOptions & {
  type: ToolType.Text;
  id: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  lineHeight: number;
};

export type Shape =
  | Rectangle
  | Ellipse
  | Diamond
  | Line
  | Arrow
  | Pencil
  | Text;
