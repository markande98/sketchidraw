"use client";

import { Edit, Hash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";

interface ColorToolTipProps {
  color: string;
  onChange: (value: string) => void;
}

export const ColorToolTip = ({ color, onChange }: ColorToolTipProps) => {
  const validateHex = (value: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = "#" + e.target.value;
    if (!validateHex(hexValue)) return;
    onChange(hexValue);
  };
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="h-6 w-6 rounded-sm cursor-pointer hover:scale-110 transition duration-200"
          style={{ backgroundColor: color ?? "transparent" }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="bg-surface-high/50 p-4 max-w-[200px]"
        sideOffset={20}
        side="right"
        showArrow={true}
      >
        <div className="flex flex-col space-y-2">
          <p className="text-[12px] font-normal tracking-tighter">Hex code</p>
          <div className="flex group items-center px-2 border rounded-md gap-1 bg-surface-high/50">
            <Hash size={16} />
            <Input
              className="border-none dark:focus:ring-0 dark:focus:ring-offset-0 placeholder:text-sm placeholder:tracking-tighter"
              placeholder="color"
              onChange={handleChange}
            />
            <Edit size={16} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
