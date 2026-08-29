// src/index.ts -- the entry point, for BOTH environments:
//   locally it connects and listens;
//   on Vercel it is imported as a serverless handler.
// Kept separate from app.ts, which holds only the Express wiring.
import "dotenv/config";
import app from "./app";
import { connectDB } from "./db";

const PORT = Number(process.env.PORT ?? 4000);

// ---- Local development -------------------------------------------------
// npm run dev lands here. Vercel sets VERCEL=1, so the serverless runtime
// never starts a listener (it cannot -- there is no server to keep alive).
if (!process.env.VERCEL) {
  async function main(): Promise<void> {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`itelect4-backend running at http://localhost:${PORT}`);
    });
  }

  main().catch((err) => {
    console.error("Failed to start the server:", err);
    process.exit(1);
  });
}

// ---- Vercel (serverless) ----------------------------------------------
// @vercel/node imports this file and calls the default export per request.
// connectDB() caches its connection, so the first request connects and
// every later request reuses it -- no connection storms.
export default async function handler(
  req: import("http").IncomingMessage,
  res: import("http").ServerResponse,
): Promise<void> {
  await connectDB();
  app(req, res);
}