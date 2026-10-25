// app/_components/BrandHeader.tsx
// Shared top bar for every screen: red zomato wordmark + lite suffix + BETA chip.
// Also home of the shared LoaderDots used while waiting on the API.

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
