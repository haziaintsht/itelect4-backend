import { Router } from "express";
import {
  listSessions,
  getSession,
  createSession,
} from "../controllers/sessionController";
import { protect, requireRole } from "../middleware/auth";
import { UserRole } from "../types";

const router = Router();

router.get("/", listSessions);
router.get("/:id", getSession);
router.post("/", protect, requireRole(UserRole.TUTOR), createSession);

export default router;
