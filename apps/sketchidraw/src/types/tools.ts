export const tools = [
  { iconName: "MousePointer" as const, label: "Select" },
  { iconName: "Hand" as const, label: "Grab" },
  { iconName: "Square" as const, label: "Rectangle" },
  { iconName: "Circle" as const, label: "Ellipse" },
  { iconName: "Diamond" as const, label: "Diamond" },
  { iconName: "Minus" as const, label: "Line" },
  { iconName: "MoveRight" as const, label: "Arrow" },
  { iconName: "Pencil" as const, label: "Pencil" },
  { iconName: "TextSvg" as const, label: "Text" },
  { iconName: "Eraser" as const, label: "Eraser" },
] as const;

export enum ToolType {
  Rectangle = "rectangle",
  Ellipse = "ellipse",
  Diamond = "diamond",
  Pencil = "pencil",
  Grab = "grab",
  Select = "select",
  Line = "line",
  Arrow = "arrow",
  Eraser = "eraser",
  Text = "text",
}
