import mongoose, { Schema, type Model } from "mongoose";
import { BookingStatus, SessionType } from "../types";

type ISession = {
  title: string;
  subject: string;
  description: string;
  tutor: mongoose.Types.ObjectId;
  status: BookingStatus;
  sessionType: SessionType;
  meetingLink: string;
};

const sessionSchema = new Schema<ISession>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },

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

sessionSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SessionModel: Model<ISession> = mongoose.model<ISession>(
  "Session",
  sessionSchema
);
