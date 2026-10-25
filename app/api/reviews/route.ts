// app/api/reviews/route.ts
// POST /api/reviews — the "write a review" waiter.
// Validates in order, inserts exactly one row, replies 201.
// The frontend is never trusted: every rule is checked here, in the kitchen.

import { NextResponse } from "next/server";
import { sql } from "@/db/db";

type ReviewBody = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function POST(request: Request) {
  let body: ReviewBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { restaurantId, rating, comment } = body;

  // Rule 1: rating is a whole number from 1 to 5.
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "rating must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  // Rule 2: comment is a non-empty string after trimming whitespace.
  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "comment must be a non-empty string." },
      { status: 400 }
    );
  }

  // Rule 3: restaurantId must point at a restaurant that actually exists.
  // This is the database lookup — the one check that needs the cold storage.
  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return NextResponse.json(
      { error: "restaurantId must be an integer." },
      { status: 400 }
    );
  }

  const existing = (await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`) as { id: number }[];
  if (existing.length === 0) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 }
    );
  }

  // The whole side effect of this endpoint: ONE new row of facts.
  // Nothing else in the database changes. No average is recalculated here.
  const inserted = (await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}
