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
    // GT4's three validation rules on ONE resource: `required` (session/
    // tutee/tutor/note), `enum` (status, above) and a min/max range here.
    // 10-160 chars mirrors the frontend Zod rule (bookingSchema.ts) so the
    // server enforces the same limit the browser already shows.
    note: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "note must be at least 10 characters"],
      maxlength: [160, "note must be at most 160 characters"],
    },
  },
  { timestamps: true }
);

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);