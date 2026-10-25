// app/review/[restaurantId]/page.tsx
// Screen 1 — write a review.
// A star picker, a comment box, a Submit button. Nothing else.
// On submit it hands three values to POST /api/reviews and steps back.
// If the backend says 400, we show the backend's words — not our own.

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BrandHeader, LoaderDots } from "@/app/_components/BrandHeader";

const RED = "#E23744";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l2.9 6.26 6.6.6-5 4.5 1.5 6.4L12 16.7 5.9 19.8l1.5-6.4-5-4.5 6.6-.6L12 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReviewPage() {
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
      <ReviewContent />
    </Suspense>
  );
}

function ReviewContent() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();
  const restaurantId = params.restaurantId;

  const [name, setName] = useState<string | null>(null);
  const [exists, setExists] = useState(true);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only one read in this whole screen: the restaurant's name,
  // so the reviewer knows what they are reviewing.
  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setExists(false);
          return;
        }
        const body = await res.json();
        setName(body.name);
      })
      .catch(() => setExists(false));
  }, [restaurantId]);

  if (!exists) {
    return (
      <main className="min-h-dvh bg-[#F7F6F3]">
        <BrandHeader />
        <div className="mx-auto max-w-[560px] px-5 py-16">
          <h1 className="text-2xl font-extrabold text-neutral-900">Restaurant not found</h1>
        </div>
      </main>
    );
  }

  const canSubmit = rating >= 1 && rating <= 5 && comment.trim().length > 0 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: Number(restaurantId),
          rating,
          comment,
        }),
      });
      if (res.status === 201) {
        router.push(`/restaurant/${restaurantId}`);
        return;
      }
      // Not invented words — the backend's message, printed as-is.
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not save this review.");
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#F7F6F3]">
      <BrandHeader />

      <main className="mx-auto w-full max-w-[560px] px-4 pb-16 pt-5">
        <section className="animate-fade-up rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Writing a review for</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-neutral-900">{name ?? "…"}</h1>

          {/* Star picker — kindness layer only. The real 1-to-5 police is the backend. */}
          <h2 className="mt-8 text-lg font-bold text-neutral-900">Rate it</h2>
          <div className="mt-3 grid grid-cols-5 gap-2" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((value) => {
              const active = (hovered || rating) >= value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  className={`flex h-16 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
                    active
                      ? "animate-star-pop border-[#E23744] bg-[#E23744]/[0.06] text-[#E23744]"
                      : "border-neutral-200 bg-white text-neutral-300 hover:border-neutral-300 hover:text-neutral-400"
                  }`}
                >
                  <StarIcon filled={active} />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sm font-semibold text-[#E23744]">{rating}/5</p>
          )}

          {/* Comment box */}
          <h2 className="mt-8 text-lg font-bold text-neutral-900">Your review</h2>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={5}
            maxLength={500}
            placeholder="How was the food, the service, the vibe?"
            className="mt-3 w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] leading-6 text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
          />
          <p className="mt-1.5 text-right text-xs tabular-nums text-neutral-400 transition-colors">{comment.length}/500</p>

          {error && (
            <p className="animate-fade-up mt-4 rounded-xl border border-[#E23744]/30 bg-rose-50 px-4 py-3 text-sm text-[#c81e2b]">
              {error}
            </p>
          )}

          {/* Disabled until rating picked and comment non-empty */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`mt-4 w-full rounded-xl py-4 text-base font-bold transition-all duration-200 ${
              canSubmit
                ? "bg-[#E23744] text-white shadow-md shadow-[#E23744]/20 hover:-translate-y-0.5 hover:bg-[#c93040] active:translate-y-0 active:scale-[0.98]"
                : "cursor-not-allowed bg-neutral-100 text-neutral-400"
            }`}
          >
            {submitting ? "Saving…" : "Submit Review"}
          </button>
          {submitting && (
            <div className="mt-3">
              <LoaderDots />
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Your review is public and cannot be edited or deleted.
        </p>
        <p className="mt-2 text-center">
          <Link
            href={`/restaurant/${restaurantId}`}
            className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
          >
            Back to {name ?? "restaurant"}
          </Link>
        </p>
      </main>
    </div>
  );
}
