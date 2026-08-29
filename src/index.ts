// src/index.ts -- the entry point: connect to MongoDB, then start listening.
import "dotenv/config";
import app from "./app";
import { connectDB } from "./db";

const PORT = Number(process.env.PORT ?? 4000);

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