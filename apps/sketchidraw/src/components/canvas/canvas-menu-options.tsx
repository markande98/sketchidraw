"use client";

import { Separator } from "../ui/separator";
import { CanvasBgColor } from "./canvas-bg-color";
import { CanvasMenuItem } from "./canvas-menu-item";
import { SocialLinks } from "./social-links";
import { ThemeToggler } from "./theme-toggler";

type CanvasMenuOptionsProps = {
  isConnected: boolean;
};

export const CanvasMenuOptions = ({ isConnected }: CanvasMenuOptionsProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <CanvasMenuItem isConnected={isConnected} />
      <Separator />
      <SocialLinks />
      <Separator />
      <ThemeToggler />
      <Separator />
      <CanvasBgColor />
    </div>
  );
};
