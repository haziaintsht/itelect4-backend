// src/db.ts -- the MongoDB connection.
// The "cache" pattern is serverless-safe: on Vercel a function can be
// woken by many requests, and each instance only connects ONCE instead
// of opening a fresh connection per request.
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Set it in .env (local) or Vercel Environment Variables (deployed)."
  );
}

const uri: string = MONGODB_URI;

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithCache = globalThis as typeof globalThis & {
  __mongooseCache?: CachedMongoose;
};

const cache: CachedMongoose =
  globalWithCache.__mongooseCache ??
  (globalWithCache.__mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        // A failed attempt must not be cached -- the next request
        // should try connecting again.
        cache.promise = null;
        throw err;
      });
  }

  try {
    cache.conn = await cache.promise;
  } catch {
    cache.promise = null;
    throw new Error("Database connection failed");
  }

  return cache.conn;
}