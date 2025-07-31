import { BackgroundOptions } from "./background-options";
import { StrokeOptions } from "./stroke-options";
import { StrokeStyle } from "./stroke-style";
import { StrokeWidth } from "./stroke-width";
import { ScrollArea } from "./ui/scroll-area";

export const CanvasProperty = () => {
  return (
    <div className="z-[100] absolute top-22 bg-surface-high/50 rounded-md left-6 w-[200px] h-[calc(100vh-180px)]">
      <ScrollArea>
        <div className="px-3 py-2 space-y-6 text-neutral-800">
          <StrokeOptions />
          <BackgroundOptions />
          <StrokeWidth />
          <StrokeStyle />
        </div>
      </ScrollArea>
    </div>
  );
};
