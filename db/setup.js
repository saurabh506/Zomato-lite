// db/setup.js
// Reads db/schema.sql and sends it to the Neon database over the internet,
// then seeds one restaurant and three reviews.
// Running this resets all data — handy while we develop.

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const schemaPath = path.join(__dirname, "schema.sql");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing. Check that .env.local exists.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log("Reading schema from db/schema.sql ...");
  const schemaText = fs.readFileSync(schemaPath, "utf8");

  // The file is a handful of statements ending in ";".
  // Send them to Postgres one at a time, in order.
  const statements = schemaText
    .split(";")
    .map((s) => s.replace(/--.*$/gm, "").trim())
    .filter(Boolean);

  console.log(`Applying ${statements.length} statements ...`);
  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log("Seeding Ludhiana Burrito and three reviews ...");
  await sql`INSERT INTO restaurants (name, cuisine, area)
    VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32')`;

  // created_at values a few days apart, so "latest review" means something.
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES
    (1, 5, 'Paneer burrito is unreal',   now() - interval '8 days'),
    (1, 4, 'Good, but slow service',     now() - interval '6 days'),
    (1, 4, 'Solid. Would repeat.',       now() - interval '2 days')`;

  console.log("\nRows now in the database:");
  console.log("restaurants:");
  console.table(await sql`SELECT * FROM restaurants`);
  console.log("reviews:");
  console.table(
    await sql`SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at`
  );

  console.log("Done.");
}

main().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
