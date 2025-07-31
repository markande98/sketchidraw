"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export const StrokeStyle = () => {
  const [strokeStyle, setStrokeColor] = useState(0);

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-white text-[11px] font-normal tracking-tigher">
        Stroke width
      </h3>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div
            onClick={() => setStrokeColor(0)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              strokeStyle === 0 && "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <D1 />
          </div>
          <div
            onClick={() => setStrokeColor(1)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              strokeStyle === 1 && "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <D2 />
          </div>
          <div
            onClick={() => setStrokeColor(2)}
            className={cn(
              "flex items-center justify-center bg-surface-high h-8 w-8 rounded-sm cursor-pointer transition duration-100",
              strokeStyle === 2 && "ring-1 ring-white bg-[#403e6a]"
            )}
          >
            <D3 />
          </div>
        </div>
      </div>
    </div>
  );
};

const D1 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-minus text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l14 0" />
    </svg>
  );
};

const D2 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-line-dashed text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12h2" />
      <path d="M17 12h2" />
      <path d="M11 12h2" />
    </svg>
  );
};

const D3 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-line-dotted text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 12v.01" />
      <path d="M8 12v.01" />
      <path d="M12 12v.01" />
      <path d="M16 12v.01" />
      <path d="M20 12v.01" />
    </svg>
  );
};
