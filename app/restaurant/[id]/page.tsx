// app/restaurant/[id]/page.tsx
// Screen 2 — the restaurant page. A pure display layer:
// it calls GET /api/restaurants/[id] and prints what it receives.
// No averages computed here, no sorting here. That is the rule.

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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

export default function RestaurantPage() {
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

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-24 text-neutral-500">
        <p>Loading…</p>
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-24">
        <h1 className="text-2xl font-semibold text-neutral-900">Restaurant not found</h1>
      </main>
    );
  }

  if (status === "error" || !data) {
    return (
      <main className="mx-auto max-w-[560px] px-6 py-24">
        <h1 className="text-2xl font-semibold text-neutral-900">Something went wrong</h1>
        <p className="mt-2 text-neutral-600">Could not load this restaurant.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[560px] px-6 py-16">
      {/* Name and location */}
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{data.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {data.cuisine} · {data.area}
      </p>

      {/* The average — printed exactly as the backend computed it.
          The frontend adds nothing, divides nothing. It just prints. */}
      <div className="mt-10 flex items-baseline gap-3">
        <span className="text-7xl font-semibold tracking-tight text-neutral-900">
          {data.averageRating ?? "—"}
        </span>
        <span className="text-sm text-neutral-500">
          {data.averageRating ? "out of 5" : null}
          {data.totalReviews > 0 ? ` — ${data.totalReviews} review${data.totalReviews === 1 ? "" : "s"}` : ""}
        </span>
      </div>

      {data.latestReview ? (
        <>
          {/* The latest review — highlighted, sits apart from the rest */}
          <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-700">Latest review</p>
            <p className="mt-3 text-[15px] leading-6 text-neutral-900">{data.latestReview.comment}</p>
            <p className="mt-3 text-xs text-neutral-500">
              rated {data.latestReview.rating}/5 — {new Date(data.latestReview.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
          </section>

          {/* Older reviews — a plain list, newest first (order comes from the API) */}
          {data.reviews.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">Earlier reviews</h2>
              <ul className="mt-3">
                {data.reviews.map((review) => (
                  <li key={review.id} className="border-b border-neutral-200 py-4 last:border-b-0">
                    <p className="text-[15px] leading-6 text-neutral-900">{review.comment}</p>
                    <p className="mt-2 text-xs text-neutral-500">
                      rated {review.rating}/5 — {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        /* Empty state — what happens when there is nothing yet */
        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-[15px] text-neutral-900">No reviews yet.</p>
          <p className="mt-1 text-sm text-neutral-500">Be the first to review {data.name}.</p>
        </div>
      )}

      {/* Write a review */}
      <div className="mt-12">
        <Link
          href={`/review/${restaurantId}`}
          className="inline-flex items-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
