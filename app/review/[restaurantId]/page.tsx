// app/review/[restaurantId]/page.tsx
// Screen 1 — write a review.
// A star picker, a comment box, a Submit button. Nothing else.
// On submit it hands three values to POST /api/reviews and steps back.
// If the backend says 400, we show the backend's words — not our own.

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
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
      <main className="mx-auto max-w-[560px] px-6 py-24">
        <h1 className="text-2xl font-semibold text-neutral-900">Restaurant not found</h1>
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
    <main className="mx-auto max-w-[560px] px-6 py-16">
      <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Write a review</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{name ?? "…"}</h1>

      {/* Star picker — kindness layer only. The real 1-to-5 police is the backend. */}
      <div className="mt-10">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Rating</p>
        <div className="mt-4 flex gap-2" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => {
            const active = (hovered || rating) >= value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHovered(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  active
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-neutral-300 bg-white text-neutral-500 hover:border-neutral-400"
                }`}
              >
                {value}
              </button>
            );
          })}
          {rating > 0 && (
            <span className="self-center pl-2 text-sm text-neutral-500">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Comment box */}
      <div className="mt-10">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Comment</p>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="What did you eat? How was it?"
          className="mt-4 w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] leading-6 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      )}

      {/* Disabled until rating picked and comment non-empty */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-8 inline-flex items-center rounded-lg px-5 py-3 text-sm font-medium transition-colors ${
          canSubmit
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "cursor-not-allowed bg-neutral-200 text-neutral-400"
        }`}
      >
        {submitting ? "Saving…" : "Submit review"}
      </button>

      <div className="mt-6">
        <Link href={`/restaurant/${restaurantId}`} className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900">
          Back to {name ?? "restaurant"}
        </Link>
      </div>
    </main>
  );
}
