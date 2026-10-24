// src/models/Course.ts
// Mongoose schema for a course. Courses are reference data: nobody
// creates a course through the API, so there is no POST route.
import mongoose, { Schema } from "mongoose";
import type { CourseDoc } from "../types/index";

// The schema enforces what the TypeScript interface could only describe.
// `code` is unique and uppercased, so GET /api/courses/itelect4 can use
// findOne and be sure there is nothing else it could have matched.
const courseSchema = new Schema<CourseDoc>({
  code: {
    type: String,
    required: [true, "code is required"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  title: { type: String, required: [true, "title is required"], trim: true },
  units: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: String, required: true, trim: true },
});

// Course never had an id -- the code is its identity -- so there is
// nothing to rename. The two fields Mongo added are the only two
// that have to come out.
courseSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Course = mongoose.model<CourseDoc>("Course", courseSchema);