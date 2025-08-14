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

export const GithubSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
    </svg>
  );
};

export const TwitterSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
};

export const LinkedIn = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
    </svg>
  );
};

export const SignupSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M21 12h-13l3 -3" />
      <path d="M11 15l-3 -3" />
    </svg>
  );
};

export const LightSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 5l0 -2" />
      <path d="M17 7l1.4 -1.4" />
      <path d="M19 12l2 0" />
      <path d="M17 17l1.4 1.4" />
      <path d="M12 19l0 2" />
      <path d="M7 17l-1.4 1.4" />
      <path d="M6 12l-2 0" />
      <path d="M7 7l-1.4 -1.4" />
    </svg>
  );
};

export const DarkSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg>
  );
};

export const SystemSvg = () => {
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
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z" />
      <path d="M7 20h10" />
      <path d="M9 16v4" />
      <path d="M15 16v4" />
    </svg>
  );
};

export const ArrowSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 40 20"
      className="h-4 w-4 text-white/90"
    >
      <g transform="" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M34 10H6M34 10L27 5M34 10L27 15"></path>
        <path d="M27.5 5L34.5 10L27.5 15"></path>
      </g>
    </svg>
  );
};

export const TriangleSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 40 20"
      className="h-4 w-4 text-white/90"
    >
      <g stroke="currentColor" fill="currentColor" transform="">
        <path d="M32 10L6 10" strokeWidth="2"></path>
        <path d="M27.5 5.5L34.5 10L27.5 14.5L27.5 5.5"></path>
      </g>
    </svg>
  );
};

export const TriangleOutlineSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 40 20"
      className="h-4 w-4 text-white/90"
    >
      <g
        stroke="currentColor"
        fill="none"
        transform=""
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M6,9.5H27"></path>
        <path d="M27,5L34,10L27,14Z" fill="none"></path>
      </g>
    </svg>
  );
};

export const TextSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white"
    >
      <g strokeWidth="1.5">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="4" y1="20" x2="7" y2="20"></line>
        <line x1="14" y1="20" x2="21" y2="20"></line>
        <line x1="6.9" y1="15" x2="13.8" y2="15"></line>
        <line x1="10.2" y1="6.3" x2="16" y2="20"></line>
        <polyline points="5 20 11 4 13 4 20 20"></polyline>
      </g>
    </svg>
  );
};

export const FontSmallSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#a)">
        <path
          d="M14.167 6.667a3.333 3.333 0 0 0-3.334-3.334H9.167a3.333 3.333 0 0 0 0 6.667h1.666a3.333 3.333 0 0 1 0 6.667H9.167a3.333 3.333 0 0 1-3.334-3.334"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
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

export const FontMediumSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#a)">
        <path
          d="M5 16.667V3.333L10 15l5-11.667v13.334"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
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

export const FontLargeSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#a)">
        <path
          d="M5.833 3.333v13.334h8.334"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
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

export const FontExtraLargeSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="m1.667 3.333 6.666 13.334M8.333 3.333 1.667 16.667M11.667 3.333v13.334h6.666"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const SketchiFontSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g strokeWidth="1.25">
        <path
          clipRule="evenodd"
          d="m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"
        ></path>
        <path d="m11.25 5.417 3.333 3.333"></path>
      </g>
    </svg>
  );
};

export const ComicShannsFontSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        clipPath="url(#a)"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.833 6.667 2.5 10l3.333 3.333M14.167 6.667 17.5 10l-3.333 3.333M11.667 3.333 8.333 16.667"></path>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export const NunitoFontSvg = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className="h-4 w-4 text-white"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.833 16.667v-10a3.333 3.333 0 0 1 3.334-3.334h1.666a3.333 3.333 0 0 1 3.334 3.334v10M5.833 10.833h8.334"></path>
      </g>
    </svg>
  );
};
