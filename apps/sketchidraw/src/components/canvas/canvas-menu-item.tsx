"use client";

import { Users, Trash2, Folder, Save, Zap } from "lucide-react";
import { MenuItem } from "./menu-item";
import { CanvaModalType } from "@/constants";

const menuItems = [
  { label: "Open", icon: Folder },
  { label: "Save to..", icon: Save },
  { label: "Command Palette", icon: Zap },
  {
    label: "Live collaboration..",
    icon: Users,
    modalType: CanvaModalType.Session,
  },
  {
    label: "Reset the Canvas",
    icon: Trash2,
    modalType: CanvaModalType.Clear,
  },
];

export const CanvasMenuItem = () => {
  return (
    <div className="flex flex-col space-y-2">
      {menuItems.map((item, index) => (
        <MenuItem
          isColor={item.icon === Zap}
          key={index}
          label={item.label}
          icon={item.icon}
          modalType={item.modalType}
        />
      ))}
    </div>
  );
};
