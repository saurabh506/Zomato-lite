# Zomato Lite

One restaurant, two screens, two APIs, two database tables — and one live URL.

## What it is

An app for **Ludhiana Burrito** (Indian, Sector 32). Visitors can:

- Read the restaurant page with its average rating, latest review highlighted, and older reviews below — **/restaurant/1**
- Write a review with a 1–5 star picker and a comment — **/review/1**

## How it works

- **Facts are stored, answers are computed.** The database holds only restaurants and reviews. The average rating, review count and latest review are computed with `AVG`, `COUNT(*)` and `ORDER BY created_at DESC` on every request. There is no `average_rating` column, ever.
- **The backend owns the logic.** The API validates every review (rating 1–5, non-empty comment, restaurant exists) regardless of what the UI allows.
- **The frontend prints.** It receives `4.5` and renders `4.5` — no maths in React.

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS · Neon Postgres via raw SQL (`@neondatabase/serverless`) · Vercel

## Getting started

```
npm install
npm run db:setup   # applies db/schema.sql and reseeds, needs DATABASE_URL in .env.local
npm run dev        # http://localhost:3000
```

## API

- `POST /api/reviews` — `{ restaurantId, rating, comment }` → 201 `{ success, reviewId }`, 400 with a plain-English `error` on any invalid input
- `GET /api/restaurants/1` — name, cuisine, area, `averageRating` (rounded to 1 decimal), `totalReviews`, `latestReview`, `reviews` (newest first, excluding the latest), or 404

## Not here on purpose

No login, no review editing or deleting, no photo uploads, no search, no ratings-breakdown chart — the product is small so the ideas inside it stay visible.
