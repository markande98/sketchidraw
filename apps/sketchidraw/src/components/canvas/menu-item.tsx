"use client";

import { CanvaModalType } from "@/constants";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isColor: boolean;
  modalType?: CanvaModalType;
}

export const MenuItem = ({
  icon: Icon,
  label,
  isColor,
  modalType,
}: MenuItemProps) => {
  const { onOpen } = useCanva();
  return (
    <div
      onClick={() => modalType && onOpen(modalType)}
      className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-surface-primary-container/50 dark:hover:bg-surface-high transition duration-150"
    >
      <Icon size={15} className={cn(isColor && "text-promo")} />
      <h2
        className={cn(
          "text-xs font-extrabold text-on-surface",
          isColor && "text-promo"
        )}
      >
        {label}
      </h2>
    </div>
  );
};
