// color constants
export const STROKE_COLORS = [
  "#d3d3d3",
  "#ff7976",
  "#308e40",
  "#589be1",
  "#af5900",
];

export const BACKGROUND_COLOR = [
  "transparent",
  "#6b90c9",
  "#003804",
  "#0e3f60",
  "#342400",
];

export const CANVAS_BG_COLOR = [
  "#121212",
  "#161718",
  "#13171b",
  "#181604",
  "#1b1715",
];

// stroke constants
export const STROKE_WIDTH = [1, 2, 3];
export const STROKE_DASH_OFFSET = [0, 5, 10];

// Handle constants
export const HANDLE_OFFSET = 10;
export const HANDLE_SIZE = 8;

export enum FillStyle {
  Hachure = "hachure",
  CrossHatch = "cross-hatch",
  Solid = "solid",
}

export enum Sloppiness {
  Architect = 0,
  Artist = 1.5,
  Cartoonist = 2.5,
}

export enum Edges {
  Sharp = 0,
  Round = 20,
}

export enum FontSize {
  Small = 25,
  Medium = 35,
  Large = 45,
  Extralarge = 55,
}

export enum FontFamily {
  SketchiFont = "Excalifont",
  Comicshanns = "Comic Shanns",
  Nunito = "Nunito",
}

export enum ArrowTypes {
  Arrow = "arrow",
  Triangle = "triangle",
  TriangleOutline = "triangleOutline",
}

export enum CursorType {
  Crosshair = "crosshair",
  Crossmove = "move",
  NWSEResize = "nwse-resize",
  NESWResize = "nesw-resize",
  Pointer = "pointer",
  None = "none",
  Grab = "grab",
  Grabbing = "grabbing",
}

export enum KeyTypes {
  Backspace = "Backspace",
  Enter = "Enter",
  Delete = "Delete",
  Escape = "Escape",
  Home = "Home",
  End = "End",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
}
