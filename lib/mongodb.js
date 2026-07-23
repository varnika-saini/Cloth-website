// =====================================================================
// 🍃  MONGODB — cached connection (serverless-safe)
// ---------------------------------------------------------------------
// One shared MongoClient is reused across hot-reloads (dev) and warm
// lambda invocations (Vercel) so we never exhaust the connection pool.
//
// Set these in .env.local (and on Vercel → Settings → Environment Vars):
//   MONGODB_URI = your MongoDB Atlas connection string
//   MONGODB_DB  = database name (optional, defaults to "shortkurti")
//
// Import is side-effect free: if MONGODB_URI is missing, nothing throws
// until you actually try to read/write, so the app still builds.
// =====================================================================
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "shortkurti";

export const isDbConfigured = Boolean(uri);

// Lazily create (and cache) the connection promise on first use.
function getClientPromise() {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (and Vercel), then restart the server."
    );
  }
  // Reuse across hot-reloads / warm invocations via a global.
  if (!globalThis.__skMongoClientPromise) {
    const client = new MongoClient(uri);
    globalThis.__skMongoClientPromise = client.connect();
  }
  return globalThis.__skMongoClientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

export async function getProductsCollection() {
  const db = await getDb();
  return db.collection("products");
}
