// app/_components/DishScene.tsx
// The banner: the original dish PHOTO, breathing slowly (Ken Burns),
// with animated steam rising off the two bowls and a warm glow that
// pulses like the food is still hot from the kitchen.
// Decorative — carries no data, so it stays a server-safe component.

export function DishScene() {
  return (
    <div className="relative h-44 w-full overflow-hidden">
      {/* The original photograph, breathing */}
      <img
        src="/dish.jpg"
        alt="Signature paneer curry in two brass bowls, steam rising"
        className="animate-kenburns block h-full w-full object-cover"
      />

      {/* Warm glow — breathing slowly after the Ken Burns rhythm */}
      <div
        className="dish-glow pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120px 80px at 27% 55%, rgba(255,214,140,0.35), transparent 70%), radial-gradient(120px 80px at 76% 55%, rgba(255,214,140,0.32), transparent 70%)",
        }}
      />

      {/* Steam wisps — blurred strokes rising from each bowl */}
      <svg
        viewBox="0 0 560 176"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="steam-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* Left bowl */}
        <g transform="translate(140 96)" filter="url(#steam-blur)" fill="none" stroke="#ffffff" strokeLinecap="round">
          <path
            className="dish-steam"
            style={{ animationDelay: "0s" }}
            strokeWidth="7"
            d="M0 26 C-12 14 12 8 0 -4 C-12 -16 8 -20 0 -30"
          />
          <g transform="translate(-26 6)">
            <path
              className="dish-steam"
              style={{ animationDelay: "1.3s" }}
              strokeWidth="5"
              d="M0 22 C-9 12 9 7 0 -3 C-9 -13 7 -16 0 -25"
            />
          </g>
          <g transform="translate(26 4)">
            <path
              className="dish-steam"
              style={{ animationDelay: "2.4s" }}
              strokeWidth="5"
              d="M0 22 C-9 12 9 7 0 -3 C-9 -13 7 -16 0 -25"
            />
          </g>
        </g>

        {/* Right bowl */}
        <g transform="translate(428 98)" filter="url(#steam-blur)" fill="none" stroke="#ffffff" strokeLinecap="round">
          <path
            className="dish-steam"
            style={{ animationDelay: "0.7s" }}
            strokeWidth="7"
            d="M0 24 C-11 13 11 8 0 -4 C-11 -15 7 -19 0 -28"
          />
          <g transform="translate(28 6)">
            <path
              className="dish-steam"
              style={{ animationDelay: "1.9s" }}
              strokeWidth="5"
              d="M0 22 C-9 12 9 7 0 -3 C-9 -13 7 -16 0 -25"
            />
          </g>
        </g>
      </svg>

      {/* Bottom fade so the white info card below reads cleanly */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }}
      />
    </div>
  );
}
