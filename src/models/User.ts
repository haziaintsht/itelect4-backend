// src/models/User.ts
// Mongoose schema for a user. Same fields as the frontend's User
// interface, plus the new `password` -- stored as a bcrypt HASH, never
// the plain text.
import mongoose, { Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole } from "../types";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  skills: string[];
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    // unique makes MongoDB reject a second signup with the same email.
    email: { type: String, required: true, unique: true, lowercase: true },
    // select: false hides the hash from normal queries -- login asks
    // for it back explicitly with .select("+password").
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TUTEE,
    },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook: hash the password once, right before it hits MongoDB.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);