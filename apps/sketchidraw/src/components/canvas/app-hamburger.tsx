import React from "react";
import { Button } from "../ui/button";

export const AppHamburger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>((props, ref) => (
  <Button
    ref={ref}
    {...props}
    variant="outline"
    className="h-10 w-10 flex items-center border sm:border-none justify-center bg-surface-low px-3 rounded-lg cursor-pointer transition-colors hover:bg-surface-high duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </svg>
  </Button>
));

AppHamburger.displayName = "AppHamburger";
