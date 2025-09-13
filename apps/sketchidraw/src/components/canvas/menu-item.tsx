"use client";

import { CanvaModalType } from "@/constants";
import { useCanva } from "@/hooks/use-canva-store";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useCallback } from "react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isColor: boolean;
  isConnected: boolean;
  modalType?: CanvaModalType;
}

export const MenuItem = ({
  icon: Icon,
  label,
  isColor,
  isConnected,
  modalType,
}: MenuItemProps) => {
  const { onOpen } = useCanva();

  const handleClick = useCallback(
    (modalType: CanvaModalType) => {
      if (modalType === CanvaModalType.Clear) {
        onOpen(modalType, null);
        return;
      }
      const hash = window.location.hash;
      if (hash) {
        const url = `${window.location.origin}/${hash}`;
        onOpen(CanvaModalType.Share, url);
        return;
      }
      onOpen(CanvaModalType.Session, null);
    },
    [onOpen]
  );
  return (
    <div
      onClick={() => modalType && handleClick(modalType)}
      className={cn(
        "flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-surface-primary-container/50 dark:hover:bg-surface-high transition duration-150",
        modalType === CanvaModalType.Session &&
          isConnected &&
          "bg-[#ecfdf5] dark:bg-[#064e3c]"
      )}
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
