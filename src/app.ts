// src/app.ts -- assembles the Express app and mounts every route.
// Kept separate from index.ts so Vercel can import the app directly.
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import courseRoutes from "./routes/courses";

const app = express();

// CORS: only the frontend origin may call this API.
// Locally: CORS_ORIGIN=http://localhost:3000 lets Vite through.
// Deployed: set CORS_ORIGIN to your Vercel frontend URL.
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Ensure the database is connected before any route runs.
// On Vercel there is no server.ts startup step, so every request
// must wait for connectDB() (which caches the connection per instance).
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// Health check -- the first thing you test after deploying.
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "itelect4-backend API is running" });
});

// Mount the three routers.
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/courses", courseRoutes);

// 404 for anything else.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// Central error handler. Express 5 automatically forwards rejected async
// handlers here, so controllers need no try/catch of their own.
// Mongoose throws specific error types -- turn those into 400s (client's
// fault) and only fall back to 500 for genuinely unexpected failures.
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // ValidationError: a schema rule (required / enum / maxlength) broke.
    if (err.name === "ValidationError") {
      res.status(400).json({ message: err.message });
      return;
    }
    // CastError: a route parameter is not a valid ObjectId.
    if (err.name === "CastError") {
      res.status(400).json({ message: "Invalid id format" });
      return;
    }
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
  }
);

export default app;