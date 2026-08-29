// src/models/Session.ts
// Mirrors the frontend Session interface. The numeric tutorId becomes
// a real reference to a User document (an ObjectId + ref).
import mongoose, { Schema, type Model } from "mongoose";
import { BookingStatus, SessionType } from "../types";

export interface ISession {
  title: string;
  subject: string;
  description: string;
  tutor: mongoose.Types.ObjectId;
  status: BookingStatus;
  sessionType: SessionType;
  meetingLink: string;
}

const sessionSchema = new Schema<ISession>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    // ref: "User" lets .populate("tutor") swap the id for the whole doc.
    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.REQUESTED,
    },
    sessionType: {
      type: String,
      enum: Object.values(SessionType),
      default: SessionType.ONE_ON_ONE,
    },
    meetingLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SessionModel: Model<ISession> = mongoose.model<ISession>(
  "Session",
  sessionSchema
);