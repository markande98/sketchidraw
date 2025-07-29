export const tools = [
  { iconName: "MousePointer" as const, label: "Select" },
  { iconName: "Hand" as const, label: "Grab" },
  { iconName: "Square" as const, label: "Rectangle" },
  { iconName: "Circle" as const, label: "Ellipse" },
  { iconName: "Diamond" as const, label: "Diamond" },
  { iconName: "Pencil" as const, label: "Pencil" },
  { iconName: "Minus" as const, label: "Line" },
  { iconName: "MoveRight" as const, label: "Arrow" },
  { iconName: "Eraser" as const, label: "Eraser" },
] as const;

type ToolWithoutLabel = Omit<(typeof tools)[number], "label">;
export type ToolType = ToolWithoutLabel[keyof ToolWithoutLabel];
