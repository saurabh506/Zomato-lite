export default function Home() {
  return (
    <main className="mx-auto max-w-[560px] px-6 py-24">
      <p className="text-lg text-neutral-800">
        Zomato Lite is alive.{" "}
        <a href="/restaurant/1" className="text-amber-700 underline underline-offset-4 hover:text-neutral-900">
          See Ludhiana Burrito →
        </a>
      </p>
    </main>
  );
}
