import { Router } from "express";
import { createStudyPlan } from "../controllers/aiController";
import { protect } from "../middleware/auth";
import { aiLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/", protect, aiLimiter, createStudyPlan);

export default router;
