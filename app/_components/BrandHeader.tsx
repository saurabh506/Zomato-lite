// app/_components/BrandHeader.tsx
// Shared top bar for every screen — sticky, translucent, quiet.
// Blur keeps content ghosts beneath it readable while scrolling.

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#FAF9F7]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[640px] items-center justify-between px-5">
        <a href="/" className="text-[21px] font-bold tracking-tight transition-opacity hover:opacity-70">
          <span className="text-[#E23744]">zomato</span>
          <span className="font-medium text-neutral-400">·lite</span>
        </a>
        <span className="rounded-full border border-[#E23744]/20 bg-[#E23744]/[0.05] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#E23744]">
          BETA
        </span>
      </div>
    </header>
  );
}

export function LoaderDots() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="loader-dot h-2 w-2 rounded-full bg-neutral-400"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
