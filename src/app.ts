// src/app.ts -- assembles the Express app and mounts every route.
// Kept separate from index.ts so Vercel can import the app directly.
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

// Global middleware: CORS (your frontend runs on :3000) + JSON bodies.
app.use(cors());
app.use(express.json());

// Health check -- the first thing you test after deploying.
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "itelect4-backend API is running" });
});

// Mount the three routers.
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 for anything else.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// Central error handler. Express 5 automatically forwards rejected async
// handlers here, so controllers need no try/catch of their own.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

export default app;