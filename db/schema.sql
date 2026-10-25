-- db/schema.sql
-- The shape of our database. Facts only:
-- one row per restaurant, one row per review.
-- Notice what is NOT here: no average_rating, no latest_review.
-- Averages and "latest" are answers we compute when asked, never facts we store.
-- More on that at the bottom of this file.

CREATE TABLE restaurants (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  area      TEXT NOT NULL
);

CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
