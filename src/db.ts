// src/db.ts -- the MongoDB connection.
// The "cache" pattern is serverless-safe: on Vercel a function can be
// woken by many requests, and each instance only connects ONCE instead
// of opening a fresh connection per request.
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/itelect4";

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
    cache.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cache.conn = await cache.promise;
  console.log("MongoDB connected");
  return cache.conn;
}