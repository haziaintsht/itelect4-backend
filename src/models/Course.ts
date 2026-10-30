import mongoose, { Schema, type Model } from "mongoose";

type ICourse = {
  code: string;
  title: string;
  units: number;
  semester: string;
};

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true, trim: true },
    units: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: String, required: true, trim: true },
  },
  { timestamps: false }
);

courseSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
