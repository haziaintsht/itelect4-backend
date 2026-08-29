// src/routes/sessionRoutes.ts
// Reading is public; creating requires a logged-in user.
import { Router } from "express";
import {
  listSessions,
  getSession,
  createSession,
} from "../controllers/sessionController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", listSessions);
router.get("/:id", getSession);
router.post("/", protect, createSession);

export default router;