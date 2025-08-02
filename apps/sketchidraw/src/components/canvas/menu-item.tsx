"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isColor: boolean;
}

export const MenuItem = ({ icon: Icon, label, isColor }: MenuItemProps) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-surface-high transition duration-150">
      <Icon size={15} className={cn(isColor && "text-[#a8a5ff]")} />
      <h2 className={cn("text-xs font-semibold", isColor && "text-[#a8a5ff]")}>
        {label}
      </h2>
    </div>
  );
};
