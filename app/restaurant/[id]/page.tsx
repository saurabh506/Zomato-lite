// app/restaurant/[id]/page.tsx
// Screen 2 — the restaurant page. A pure display layer:
// it calls GET /api/restaurants/[id] and paints what it receives.
// No averages computed here, no sorting here. That rule has not moved.

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { BrandHeader } from "@/app/_components/BrandHeader";

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

const RED = "#E23744";
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

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function chipClass(rating: number) {
  if (rating >= 4) return "bg-[#1F7A3F] text-white";
  if (rating === 3) return "bg-[#B7791F] text-white";
  return "bg-[#E23744] text-white";
}

export default function RestaurantPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-[#F7F6F3] text-neutral-500">
          <BrandHeader />
          <div className="mx-auto max-w-[560px] px-5 py-16">
            <p>Loading…</p>
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

  const frame = "min-h-dvh flex flex-col bg-[#F7F6F3]";

  if (status === "loading") {
    return (
      <div className={frame}>
        <BrandHeader />
        <main className="mx-auto w-full max-w-[560px] flex-1 px-5 py-16 text-neutral-500">
          <p>Loading…</p>
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

      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-36 pt-5">
        {/* Restaurant card: red dotted banner + facts */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div
            className="flex h-40 items-end px-6 py-5"
            style={{
              backgroundColor: RED,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          >
            <span className="text-5xl font-extrabold tracking-tight text-white">{initials(data.name)}</span>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">{data.name}</h1>
                <p className="mt-1 text-sm text-neutral-500">{data.area}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">{data.cuisine}</span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">Dine-in</span>
                </div>
              </div>

              {data.averageRating !== null && (
                <div className="flex flex-col items-center rounded-xl bg-[#1F7A3F] px-4 py-2.5 text-white">
                  {/* Printed exactly as the backend handed it over. */}
                  <span className="text-4xl font-bold leading-none">{data.averageRating}</span>
                  <span className="mt-1 text-xs text-white/85">/5</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm font-medium text-neutral-500">
              {data.totalReviews > 0
                ? `Based on ${data.totalReviews} review${data.totalReviews === 1 ? "" : "s"}`
                : "No reviews yet"}
            </p>
          </div>
        </section>

        {data.latestReview ? (
          <>
            {/* The latest review — highlighted card with green edge */}
            <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-400">Latest review</h2>
            <article className="relative mt-4 rounded-xl border border-l-4 border-l-[#1F7A3F] border-neutral-200 bg-white p-5 shadow-sm">
              <span className="absolute -top-3 left-4 rounded-md bg-[#1F7A3F] px-3 py-1 text-[10px] font-bold tracking-wide text-white">
                LATEST
              </span>
              <div className="flex items-center justify-between">
                <span className={`rounded-md px-2.5 py-1 text-sm font-bold ${chipClass(data.latestReview.rating)}`}>
                  {data.latestReview.rating}
                </span>
                <span className="text-sm text-neutral-400">{timeAgo(data.latestReview.createdAt)}</span>
              </div>
              <p className="mt-3 text-[15px] leading-6 text-neutral-800">{data.latestReview.comment}</p>
            </article>

            {/* Older reviews — plain cards, newest first (order comes from the API) */}
            {data.reviews.length > 0 && (
              <>
                <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-400">Earlier reviews</h2>
                <div className="mt-4 space-y-3">
                  {data.reviews.map((review) => (
                    <article key={review.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-md px-2.5 py-1 text-sm font-bold ${chipClass(review.rating)}`}>
                          {review.rating}
                        </span>
                        <span className="text-sm text-neutral-400">{timeAgo(review.createdAt)}</span>
                      </div>
                      <p className="mt-2.5 text-[15px] leading-6 text-neutral-800">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-[15px] font-semibold text-neutral-900">No reviews yet.</p>
            <p className="mt-1 text-sm text-neutral-500">Be the first to review {data.name}.</p>
          </div>
        )}
      </main>

      {/* Sticky bottom CTA — the one loud red element on the page */}
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[#F7F6F3] via-[#F7F6F3]/85 to-transparent px-4 pb-4 pt-6">
        <Link
          href={`/review/${restaurantId}`}
          className="mx-auto flex w-full max-w-[528px] items-center justify-center rounded-xl bg-[#E23744] py-4 text-base font-bold text-white transition-colors hover:bg-[#c93040]"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
}
