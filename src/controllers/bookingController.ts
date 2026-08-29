// src/controllers/bookingController.ts
// FULL CRUD on bookings, and EVERY route runs behind the protect
// middleware (the JWT gate) -- no token, no controller.
import type { Request, Response } from "express";
import { BookingModel, type IBooking } from "../models/Booking";
import { SessionModel } from "../models/Session";
import { BookingStatus, type AuthenticatedRequest } from "../types";

// GET /api/bookings -- only YOUR bookings
export async function listBookings(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const bookings = await BookingModel.find({ tutee: userId })
    .populate("session", "title subject")
    .populate("tutor", "name");
  res.json(bookings);
}

// GET /api/bookings/:id
export async function getBooking(
  req: Request,
  res: Response
): Promise<void> {
  const booking = await BookingModel.findById(req.params.id)
    .populate("session", "title subject")
    .populate("tutor", "name");
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.json(booking);
}

// POST /api/bookings -- { session, note }; tutee = the logged-in user,
// and the tutor comes FROM the session (mirrors what the frontend form
// computes in BookingsPage.onSubmit).
export async function createBooking(
  req: Request,
  res: Response
): Promise<void> {
  const { session, note } = req.body as { session?: string; note?: string };

  if (!session || !note) {
    res.status(400).json({ message: "session and note are required" });
    return;
  }

  const foundSession = await SessionModel.findById(session);
  if (!foundSession) {
    res.status(404).json({ message: "Session not found" });
    return;
  }

  const userId = (req as AuthenticatedRequest).userId;
  const booking = await BookingModel.create({
    session: foundSession._id,
    tutee: userId,
    tutor: foundSession.tutor,
    status: BookingStatus.REQUESTED,
    note,
  });

  res.status(201).json(booking);
}

// PATCH /api/bookings/:id -- update the status or the note
export async function updateBooking(
  req: Request,
  res: Response
): Promise<void> {
  const updates = req.body as Partial<IBooking>;
  const booking = await BookingModel.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true, // return the document AFTER the update
      runValidators: true, // re-check schema rules (e.g. the enum)
    }
  )
    .populate("session", "title subject")
    .populate("tutor", "name");

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.json(booking);
}

// DELETE /api/bookings/:id
export async function deleteBooking(
  req: Request,
  res: Response
): Promise<void> {
  const booking = await BookingModel.findByIdAndDelete(req.params.id);
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.status(204).end(); // 204 No Content
}