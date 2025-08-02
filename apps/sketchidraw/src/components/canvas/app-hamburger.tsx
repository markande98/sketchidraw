import React from "react";

export const AppHamburger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>((props, ref) => (
  <button
    ref={ref}
    {...props}
    className="z-[100] dark:bg-surface-high/50 p-3 rounded-md cursor-pointer transition-colors hover:bg-surface-high/70 duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </svg>
  </button>
));

AppHamburger.displayName = "AppHamburger";
