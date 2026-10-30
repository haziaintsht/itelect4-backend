import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

connectDB().catch((err: unknown) => {
  console.error("Could not connect to MongoDB:", err);
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
