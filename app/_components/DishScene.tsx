// app/_components/DishScene.tsx
// The animated banner: an illustrated "chef is cooking" scene.
// Pure SVG + CSS classes from globals.css (steam, flames, spatula).
// Decorative — carries no data, so it stays a server-safe component.

export function DishScene() {
  return (
    <svg
      viewBox="0 0 560 176"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Animated illustration: a paneer roll sizzling on a hot tawa, steam rising, flames flickering while a spatula turns it"
      className="block h-44 w-full"
    >
      <defs>
        <pattern id="dish-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.6" fill="#ffffff" opacity="0.16" />
        </pattern>
        <radialGradient id="dish-vignette" cx="22%" cy="18%" r="90%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brand red backdrop + dots + soft light */}
      <rect width="560" height="176" fill="#E23744" />
      <rect width="560" height="176" fill="url(#dish-dots)" />
      <rect width="560" height="176" fill="url(#dish-vignette)" />

      {/* Counter the pan sits on */}
      <rect y="150" width="560" height="26" fill="#C22B37" />
      <rect y="150" width="560" height="2" fill="#A8222D" />

      {/* Flames under the pan edge — flickering. Position sits on an outer
          <g>, the animation runs on an inner one, so CSS transform never
          clobbers the placement transform. */}
      {[
        { x: 118, d: "0s" },
        { x: 158, d: "0.25s" },
        { x: 208, d: "0.5s" },
        { x: 252, d: "0.12s" },
      ].map((flame) => (
        <g key={flame.x} transform={`translate(${flame.x} 150)`}>
          <g className="dish-flame" style={{ animationDelay: flame.d }}>
            <path d="M0 0 C-5 -8 -3 -14 0 -18 C3 -14 5 -8 0 0 Z" fill="#FF8A3C" opacity="0.9" />
            <path d="M0 -2 C-2.5 -6 -1.5 -10 0 -12 C1.5 -10 2.5 -6 0 -2 Z" fill="#FFC53D" />
          </g>
        </g>
      ))}

      {/* Tawa (griddle) */}
      <ellipse cx="190" cy="144" rx="142" ry="19" fill="#5A2418" />
      <ellipse cx="190" cy="141" rx="128" ry="14" fill="#7A2E1B" />
      <ellipse cx="150" cy="139" rx="36" ry="7" fill="#8A3A23" opacity="0.7" />
      <rect x="326" y="138" width="62" height="7" rx="3.5" fill="#5A2418" />

      {/* The roll — a paneer burrito on the tawa */}
      <g transform="translate(122 108) rotate(-12)">
        <rect x="0" y="0" width="116" height="34" rx="17" fill="#EFB94F" />
        {/* toasted seam */}
        <path d="M8 6 q52 -8 100 0" stroke="#D8993A" strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round" />
        <path d="M10 26 q50 8 96 0" stroke="#D8993A" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
        {/* open end with filling */}
        <circle cx="104" cy="17" r="15" fill="#E4A83C" />
        <circle cx="104" cy="17" r="12" fill="#F2D9A0" />
        <path d="M98 12 q7 5 12 1" stroke="#C4452E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M97 19 q8 6 14 2" stroke="#7FA35C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M98 25 q7 4 12 0" stroke="#C4452E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Steam above the roll — positioned by outer groups, animated inner */}
      <g fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
        <g transform="translate(158 76)">
          <path
            className="dish-steam"
            style={{ animationDelay: "0s" }}
            d="M0 14 C-7 6 7 2 0 -6 C-7 -13 5 -16 0 -22"
          />
        </g>
        <g transform="translate(180 70)">
          <path
            className="dish-steam"
            style={{ animationDelay: "1s" }}
            d="M0 14 C-7 6 7 2 0 -6 C-7 -13 5 -16 0 -22"
          />
        </g>
        <g transform="translate(202 76)">
          <path
            className="dish-steam"
            style={{ animationDelay: "2s" }}
            d="M0 14 C-7 6 7 2 0 -6 C-7 -13 5 -16 0 -22"
          />
        </g>
      </g>

      {/* Spatula pressing and turning the roll */}
      <g className="dish-spatula">
        <rect x="296" y="52" width="11" height="58" rx="5.5" transform="rotate(32 301 60)" fill="#3B2B24" />
        <ellipse cx="256" cy="102" rx="27" ry="11" transform="rotate(-16 256 102)" fill="#A7A9AE" />
        <ellipse cx="256" cy="100" rx="19" ry="6.5" transform="rotate(-16 256 100)" fill="#C9CBD1" />
      </g>

      {/* Served slices on a small plate — the payoff, at rest */}
      <g transform="translate(418 132)">
        <ellipse cx="26" cy="14" rx="52" ry="14" fill="#F7EFE2" />
        <ellipse cx="26" cy="12" rx="46" ry="11" fill="#FFFFFF" />
        <g transform="rotate(-10 14 6)">
          <rect x="-6" y="-8" width="34" height="15" rx="7.5" fill="#EFB94F" />
          <rect x="20" y="-8" width="14" height="15" rx="7" fill="#F2D9A0" />
          <path d="M24 -2 q5 4 8 1" stroke="#C4452E" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <g transform="rotate(7 48 4)">
          <rect x="30" y="-3" width="32" height="14" rx="7" fill="#EFB94F" />
          <rect x="46" y="-3" width="13" height="14" rx="6.5" fill="#F2D9A0" />
          <path d="M50 3 q5 4 8 1" stroke="#7FA35C" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
