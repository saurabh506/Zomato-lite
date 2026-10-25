// app/restaurant/[id]/page.tsx
// Screen 2 — the restaurant page. A pure display layer:
// it calls GET /api/restaurants/[id] and paints what it receives.
// No averages computed here, no sorting here. That rule has not moved.

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { BrandHeader, LoaderDots } from "@/app/_components/BrandHeader";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

const GREEN = "#1F7A3F";

// Presentation formatting only — turning a timestamp the API sent
// into human words. No rating arithmetic happens in this file.
function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function reviewDotClass(rating: number) {
  if (rating >= 4) return "bg-[#1F7A3F]";
  if (rating === 3) return "bg-[#B7791F]";
  return "bg-[#E23744]";
}

// Pure decoration: eases the display from 0 up to the value the API sent,
// over ~700ms, and the final frame is EXACTLY the API's number.
// No rating maths lives here — the average was computed in the backend.
function CountUpRating({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 700;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span suppressHydrationWarning>{display.toFixed(1)}</span>;
}

export default function RestaurantPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#FAF9F7] text-neutral-500">
          <BrandHeader />
          <div className="mx-auto max-w-[560px] px-5 py-16">
            <LoaderDots />
          </div>
        </main>
      }
    >
      <RestaurantContent />
    </Suspense>
  );
}

function RestaurantContent() {
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`);
      if (res.status === 404) {
        setStatus("notfound");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setData(await res.json());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [restaurantId]);

  useEffect(() => {
    load();
  }, [load]);

  const frame = "min-h-dvh flex flex-col bg-[#FAF9F7]";

  if (status === "loading") {
    return (
      <div className={frame}>
        <BrandHeader />
        <main className="mx-auto w-full max-w-[560px] flex-1 px-5 py-16 text-neutral-500">
          <LoaderDots />
        </main>
      </div>
    );
  }

  if (status === "notfound" || status === "error" || !data) {
    return (
      <div className={frame}>
        <BrandHeader />
        <main className="mx-auto w-full max-w-[560px] flex-1 px-5 py-16">
          <h1 className="text-2xl font-extrabold text-neutral-900">
            {status === "notfound" ? "Restaurant not found" : "Something went wrong"}
          </h1>
          <p className="mt-2 text-neutral-500">Could not load this restaurant.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={frame}>
      <BrandHeader />

      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-36 pt-6">
        {/* Restaurant card: dish photo banner (slow Ken Burns) + facts */}        <section className="animate-fade-up overflow-hidden rounded-[20px] border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.12)]">
          <div className="relative h-44 overflow-hidden">
            <img
              src="/dish.jpg"
              alt={`${data.name} — signature paneer curry in brass bowls`}
              className="animate-kenburns h-full w-full object-cover"
            />
            {/* Brand red veil + dotted pattern over the photo */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(226, 55, 68, 0.22)",
                backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 1.5px)",
                backgroundSize: "18px 18px",
              }}
            />
          </div>

          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[22px] font-bold leading-tight tracking-[-0.01em] text-neutral-900">{data.name}</h1>
                <p className="mt-1 text-sm text-neutral-500">{data.area}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                    {data.cuisine}
                  </span>
                  <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                    Dine-in
                  </span>
                </div>
              </div>

              {data.averageRating !== null && (
                <div className="animate-pop flex flex-col items-center rounded-2xl bg-[#1F7A3F] px-3.5 py-2 text-white shadow-[0_2px_8px_-2px_rgba(31,122,63,0.5)]">
                  {/* Printed by easing up to the exact value the backend computed. */}
                  <span className="text-[26px] font-bold leading-7 tracking-tight tabular-nums">
                    <CountUpRating value={data.averageRating} />
                  </span>
                  <span className="text-[10px] font-medium text-white/80">/ 5</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-[13px] font-medium text-neutral-400">
              {data.totalReviews > 0
                ? `Based on ${data.totalReviews} review${data.totalReviews === 1 ? "" : "s"}`
                : "No reviews yet"}
            </p>
          </div>
        </section>

        {data.latestReview ? (
          <>
            {/* The latest review — highlighted with a quiet green system */}
            <h2
              className="animate-fade-up mt-9 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400"
              style={{ animationDelay: "80ms" }}
            >
              Latest review
            </h2>
            <article
              className="animate-fade-up relative mt-3.5 rounded-[20px] border border-neutral-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              style={{ animationDelay: "140ms" }}
            >
              <span className="absolute -top-2.5 left-5 rounded-full bg-[#1F7A3F] px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-white">
                LATEST
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className={`flex items-center gap-2 text-sm font-semibold text-neutral-800`}>
                  <span className={`h-2 w-2 rounded-full ${reviewDotClass(data.latestReview.rating)}`} />
                  {data.latestReview.rating}/5
                </span>
                <span className="text-[13px] tabular-nums text-neutral-400">
                  {timeAgo(data.latestReview.createdAt)}
                </span>
              </div>
              <p className="mt-2.5 text-[15px] leading-6 text-neutral-800">{data.latestReview.comment}</p>
            </article>

            {/* Older reviews — one clean column with hairline dividers */}
            {data.reviews.length > 0 && (
              <>
                <h2 className="mt-9 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Earlier reviews
                </h2>
                <div className="mt-3.5 overflow-hidden rounded-[20px] border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  {data.reviews.map((review, index) => (
                    <article
                      key={review.id}
                      className={`px-5 py-4 transition-colors hover:bg-neutral-50/60 ${
                        index > 0 ? "border-t border-neutral-100" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                          <span className={`h-2 w-2 rounded-full ${reviewDotClass(review.rating)}`} />
                          {review.rating}/5
                        </span>
                        <span className="text-[13px] tabular-nums text-neutral-400">{timeAgo(review.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-[15px] leading-6 text-neutral-700">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-[20px] border border-neutral-200/80 bg-white p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="text-[15px] font-semibold text-neutral-900">No reviews yet.</p>
            <p className="mt-1 text-sm text-neutral-500">Be the first to review {data.name}.</p>
          </div>
        )}
      </main>

      {/* Sticky bottom CTA — the one loud red element on the page */}
      <div className="animate-rise fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#FAF9F7] via-[#FAF9F7]/90 to-transparent px-4 pb-4 pt-8">
        <Link
          href={`/review/${restaurantId}`}
          className="mx-auto flex w-full max-w-[528px] items-center justify-center rounded-2xl bg-[#E23744] py-3.5 text-[15px] font-semibold tracking-tight text-white shadow-[0_4px_16px_-4px_rgba(226,55,68,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#c93040] active:translate-y-0 active:scale-[0.99]"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
}
