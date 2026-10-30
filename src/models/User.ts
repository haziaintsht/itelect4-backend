import mongoose, { Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole } from "../types";

type IUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  skills: string[];
  isActive: boolean;
};

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
