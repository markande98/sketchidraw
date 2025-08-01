export const HachureSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white/90"
    >
      <path
        d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
        stroke="currentColor"
        strokeWidth="1.25"
      ></path>
      <mask
        id="FillHachureIcon"
        maskUnits="userSpaceOnUse"
        x="2"
        y="2"
        width="13"
        height="16"
        style={{ maskType: "alpha" }}
      >
        <path
          d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.25"
        ></path>
      </mask>
      <g mask="url(#FillHachureIcon)">
        <path
          d="M2.258 15.156 15.156 2.258M7.324 20.222 20.222 7.325m-20.444 5.35L12.675-.222m-8.157 18.34L17.416 5.22"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};

export const CrossHatchSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white/90"
    >
      <g clipPath="url(#a)">
        <path
          d="M5.879 2.625h8.242a3.254 3.254 0 0 1 3.254 3.254v8.242a3.254 3.254 0 0 1-3.254 3.254H5.88a3.254 3.254 0 0 1-3.254-3.254V5.88a3.254 3.254 0 0 1 3.254-3.254Z"
          stroke="currentColor"
          strokeWidth="1.25"
        ></path>
        <mask
          id="FillCrossHatchIcon"
          maskUnits="userSpaceOnUse"
          x="-1"
          y="-1"
          width="22"
          height="22"
          style={{ maskType: "alpha" }}
        >
          <path
            d="M2.426 15.044 15.044 2.426M7.383 20 20 7.383M0 12.617 12.617 0m-7.98 17.941L17.256 5.324m-2.211 12.25L2.426 4.956M20 12.617 7.383 0m5.234 20L0 7.383m17.941 7.98L5.324 2.745"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </mask>
        <g mask="url(#FillCrossHatchIcon)">
          <path
            d="M14.121 2H5.88A3.879 3.879 0 0 0 2 5.879v8.242A3.879 3.879 0 0 0 5.879 18h8.242A3.879 3.879 0 0 0 18 14.121V5.88A3.879 3.879 0 0 0 14.121 2Z"
            fill="currentColor"
          ></path>
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export const SolidSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white/90"
    >
      <g clipPath="url(#a)">
        <path
          d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z"
          stroke="currentColor"
          strokeWidth="1.25"
        ></path>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export const ArchitectSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white/90"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M2.5 12.038c1.655-.885 5.9-3.292 8.568-4.354 2.668-1.063.101 2.821 1.32 3.104 1.218.283 5.112-1.814 5.112-1.814"
        strokeWidth="1.25"
      ></path>
    </svg>
  );
};

export const ArtistSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white/90"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43"
        strokeWidth="1.25"
      ></path>
    </svg>
  );
};

export const CartoonistSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white/90"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M2.5 12.563c1.655-.886 5.9-3.293 8.568-4.355 2.668-1.062.101 2.822 1.32 3.105 1.218.283 5.112-1.814 5.112-1.814m-13.469 2.23c2.963-1.586 6.13-5.62 7.468-4.998 1.338.623-1.153 4.11-.132 5.595 1.02 1.487 6.133-1.43 6.133-1.43"
        strokeWidth="1.25"
      ></path>
    </svg>
  );
};

export const SharpEdgeSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white/90"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <svg strokeWidth="1.5">
        <path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path>
        <path d="M13.3333 3.33331V3.34331"></path>
        <path d="M16.6667 3.33331V3.34331"></path>
        <path d="M16.6667 6.66669V6.67669"></path>
        <path d="M16.6667 10V10.01"></path>
        <path d="M3.33334 13.3333V13.3433"></path>
        <path d="M16.6667 13.3333V13.3433"></path>
        <path d="M3.33334 16.6667V16.6767"></path>
        <path d="M6.66666 16.6667V16.6767"></path>
        <path d="M10 16.6667V16.6767"></path>
        <path d="M13.3333 16.6667V16.6767"></path>
        <path d="M16.6667 16.6667V16.6767"></path>
      </svg>
    </svg>
  );
};

export const RoundEdgeSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-white/90"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        strokeWidth="1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 12v-4a4 4 0 0 1 4 -4h4"></path>
        <line x1="16" y1="4" x2="16" y2="4.01"></line>
        <line x1="20" y1="4" x2="20" y2="4.01"></line>
        <line x1="20" y1="8" x2="20" y2="8.01"></line>
        <line x1="20" y1="12" x2="20" y2="12.01"></line>
        <line x1="4" y1="16" x2="4" y2="16.01"></line>
        <line x1="20" y1="16" x2="20" y2="16.01"></line>
        <line x1="4" y1="20" x2="4" y2="20.01"></line>
        <line x1="8" y1="20" x2="8" y2="20.01"></line>
        <line x1="12" y1="20" x2="12" y2="20.01"></line>
        <line x1="16" y1="20" x2="16" y2="20.01"></line>
        <line x1="20" y1="20" x2="20" y2="20.01"></line>
      </g>
    </svg>
  );
};
