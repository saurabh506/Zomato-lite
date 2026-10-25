export default function Home() {
  return (
    <div className="min-h-dvh bg-[#F7F6F3]">
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
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg text-neutral-800">Your reviewing corner is live.</p>
          <a
            href="/restaurant/1"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#E23744] px-5 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#c93040]"
          >
            See Ludhiana Burrito →
          </a>
        </section>
      </main>
    </div>
  );
}
