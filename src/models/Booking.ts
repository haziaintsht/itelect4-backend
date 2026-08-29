// src/models/Booking.ts
// Mirrors the frontend Booking interface. This is the resource that gets
// FULL CRUD: session/tutee/tutor are references, status is the same enum.
import mongoose, { Schema, type Model } from "mongoose";
import { BookingStatus } from "../types";

export interface IBooking {
  session: mongoose.Types.ObjectId;
  tutee: mongoose.Types.ObjectId;
  tutor: mongoose.Types.ObjectId;
  status: BookingStatus;
  note: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    tutee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.REQUESTED,
    },
    note: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);