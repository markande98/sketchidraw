import { Tool } from "./tool";

const tools = [
  "MousePointer",
  "Hand",
  "Square",
  "Circle",
  "Diamond",
  "Pencil",
  "Minus",
  "MoveRight",
  "Eraser",
] as const;

export const ToolsMenu = () => {
  return (
    <div className="flex items-center bg-surface-high/50 p-2 gap-6 rounded-md transition duration-200">
      {tools.map((toolName, index) => (
        <Tool
          key={index}
          label={toolName}
          iconName={toolName}
          index={index + 1}
        />
      ))}
    </div>
  );
};
