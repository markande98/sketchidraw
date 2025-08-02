import { BackgroundOptions } from "./background-options";
import { EdgeStyle } from "./edge.style";
import { FillStyle } from "./fill-style";
import { Sloppiness } from "./sloppiness";
import { StrokeOptions } from "./stroke-options";
import { StrokeStyle } from "./stroke-style";
import { StrokeWidth } from "./stroke-width";
import { ScrollArea } from "./ui/scroll-area";

export const CanvasProperty = () => {
  return (
    <ScrollArea className="z-[100] absolute top-22 bg-surface-high/50 rounded-md left-6 w-[200px] h-[calc(100vh-250px)]">
      <div className="px-3 py-2 space-y-6 text-neutral-800">
        <StrokeOptions />
        <BackgroundOptions />
        <FillStyle />
        <StrokeWidth />
        <StrokeStyle />
        <Sloppiness />
        <EdgeStyle />
      </div>
    </ScrollArea>
  );
};
