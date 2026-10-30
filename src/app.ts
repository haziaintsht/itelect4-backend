import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import courseRoutes from "./routes/courses";
import aiRoutes from "./routes/aiRoutes";

const app = express();

const corsOrigin = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""));
app.use(cors({ origin: corsOrigin.length === 1 ? corsOrigin[0] : corsOrigin }));
app.use(express.json());

app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/ai", aiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${String(err.value)}" is not a valid id`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  },
);

export default app;
