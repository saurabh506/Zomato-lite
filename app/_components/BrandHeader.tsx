// app/_components/BrandHeader.tsx
// Shared top bar for every screen: red zomato wordmark + lite suffix + BETA chip.
// Static decoration only — no data, no fetches.

export function BrandHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="relative mx-auto flex h-16 w-full max-w-[640px] items-center justify-between px-5">
        <a href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#E23744]">zomato</span>
          <span className="font-semibold text-neutral-300">·lite</span>
        </a>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold tracking-wide text-[#E23744]">
          BETA
        </span>
      </div>
    </header>
  );
}
