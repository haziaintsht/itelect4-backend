

import { Router } from "express";
import {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.get("/", listBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.patch("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;