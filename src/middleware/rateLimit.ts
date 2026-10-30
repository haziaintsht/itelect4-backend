import type { Request } from "express";
import { rateLimit } from "express-rate-limit";
import type { AuthenticatedRequest } from "../types";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req: Request) => (req as AuthenticatedRequest).userId,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many study plan requests. Wait a minute and try again." },
  // Vercel always sends X-Forwarded-For; the key is the user id, so the IP is never used.
  validate: { xForwardedForHeader: false },
});
