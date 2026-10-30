import mongoose, { Schema, type Model } from "mongoose";
import { BookingStatus } from "../types";

export type IBooking = {
  session: mongoose.Types.ObjectId;
  tutee: mongoose.Types.ObjectId;
  tutor: mongoose.Types.ObjectId;
  status: BookingStatus;
  note: string;
};

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

bookingSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);
