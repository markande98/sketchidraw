"use client";

import { Separator } from "../ui/separator";
import { CanvasBgColor } from "./canvas-bg-color";
import { CanvasMenuItem } from "./canvas-menu-item";
import { SocialLinks } from "./social-links";
import { ThemeToggler } from "./theme-toggler";

export const CanvasMenuOptions = () => {
  return (
    <div className="flex flex-col space-y-4">
      <CanvasMenuItem />
      <Separator />
      <SocialLinks />
      <Separator />
      <ThemeToggler />
      <Separator />
      <CanvasBgColor />
    </div>
  );
};
