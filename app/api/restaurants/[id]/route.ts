// app/api/restaurants/[id]/route.ts
// GET /api/restaurants/1 — the "load the restaurant page" waiter.
// Response is shaped exactly like the screen: name, big average,
// latest review highlighted, then the older ones newest first.

import { NextResponse } from "next/server";
import { sql } from "@/db/db";

type ReviewRow = { id: number; rating: number; comment: string; created_at: Date };

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/restaurants/[id]">
) {
  // In current Next.js, params is a Promise — await it, then read the value.
  const { id } = await ctx.params;
  const restaurantId = Number(id);

  const restaurants = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `;
  if (restaurants.length === 0) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 }
    );
  }

  const restaurant = restaurants[0];

  const allReviews = await sql<ReviewRow[]>`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  `;

  // The three answers, computed fresh from facts every single request.
  // Nothing below is stored anywhere; it lives only for this response.
  const totalReviews = allReviews.length;

  let averageRating: number | null = null;
  if (totalReviews > 0) {
    const avg = await sql<{ avg: string | null }[]>`
      SELECT AVG(rating)::text AS avg FROM reviews WHERE restaurant_id = ${restaurantId}
    `;
    const parsed = Number.parseFloat(avg[0].avg ?? "NaN");
    averageRating = Number.isNaN(parsed) ? null : Math.round(parsed * 10) / 10;
  }

  const [latestReview, ...reviews] = allReviews;

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating,
    totalReviews,
    latestReview: latestReview
      ? {
          id: latestReview.id,
          rating: latestReview.rating,
          comment: latestReview.comment,
          createdAt: latestReview.created_at,
        }
      : null,
    reviews: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
    })),
  });
}
