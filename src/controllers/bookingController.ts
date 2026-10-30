import type { Request, Response } from "express";
import { BookingModel } from "../models/Booking";
import { SessionModel } from "../models/Session";
import { BookingStatus, type AuthenticatedRequest } from "../types";

export async function listBookings(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const bookings = await BookingModel.find({
    $or: [{ tutee: userId }, { tutor: userId }],
  })
    .populate("session", "title subject")
    .populate("tutee", "name")
    .populate("tutor", "name");
  res.json(bookings);
}

export async function getBooking(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const booking = await BookingModel.findOne({
    _id: req.params.id,
    $or: [{ tutee: userId }, { tutor: userId }],
  })
    .populate("session", "title subject")
    .populate("tutee", "name")
    .populate("tutor", "name");
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.json(booking);
}

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

// A booking only moves forward: requested -> confirmed -> completed.
const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  [BookingStatus.REQUESTED]: BookingStatus.CONFIRMED,
  [BookingStatus.CONFIRMED]: BookingStatus.COMPLETED,
};

export async function updateBooking(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const { status, note } = req.body as {
    status?: BookingStatus;
    note?: string;
  };

  const booking = await BookingModel.findOne({
    _id: req.params.id,
    $or: [{ tutee: userId }, { tutor: userId }],
  });

  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }

  if (status !== undefined && status !== booking.status) {
    if (booking.tutor.toString() !== userId) {
      res.status(403).json({ message: "Only the tutor can change a booking's status" });
      return;
    }

    const next = NEXT_STATUS[booking.status];
    if (status !== next) {
      res.status(400).json({
        message: next
          ? `A ${booking.status} booking can only become ${next}`
          : `A ${booking.status} booking cannot change any more`,
      });
      return;
    }

    booking.status = status;
  }

  if (note !== undefined) booking.note = note;

  await booking.save();
  await booking.populate([
    { path: "session", select: "title subject" },
    { path: "tutee", select: "name" },
    { path: "tutor", select: "name" },
  ]);
  res.json(booking);
}

export async function deleteBooking(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const booking = await BookingModel.findOneAndDelete({
    _id: req.params.id,
    $or: [{ tutee: userId }, { tutor: userId }],
  });
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.status(204).end();
}
