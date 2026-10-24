


import type { Request, Response } from "express";
import { BookingModel, type IBooking } from "../models/Booking";
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




export async function updateBooking(
  req: Request,
  res: Response
): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const { status, note } = req.body as {
    status?: BookingStatus;
    note?: string;
  };

  const updates: Partial<Pick<IBooking, "status" | "note">> = {};
  if (status !== undefined) updates.status = status;
  if (note !== undefined) updates.note = note;

  const booking = await BookingModel.findOneAndUpdate(
    {
      _id: req.params.id,
      $or: [{ tutee: userId }, { tutor: userId }],
    },
    updates,
    {
      new: true, 
      runValidators: true, 
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