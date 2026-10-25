export default function Home() {
  return (
    <div className="min-h-dvh bg-[#FAF9F7]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="relative mx-auto flex h-16 w-full max-w-[640px] items-center justify-between px-5">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#E23744]">zomato</span>
            <span className="font-semibold text-neutral-300">·lite</span>
          </span>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold tracking-wide text-[#E23744]">
            BETA
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[560px] px-4 py-16">
        <section className="animate-fade-up rounded-[20px] border border-neutral-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.12)]">
          <p className="text-lg text-neutral-800">Your reviewing corner is live.</p>
          <a
            href="/restaurant/1"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#E23744] px-5 py-3 text-[15px] font-semibold tracking-tight text-white shadow-[0_4px_16px_-4px_rgba(226,55,68,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#c93040] active:translate-y-0 active:scale-[0.99]"
          >
            See Ludhiana Burrito →
          </a>
        </section>
      </main>
    </div>
  );
}
