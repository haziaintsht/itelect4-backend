// src/data/courses.ts
// The three courses the frontend shows. They are reference data:
// nobody creates a course through the API, so they live here and go
// into the database once, from src/seed.ts.
//
// Running the seed script a second time changes nothing -- upsert
// leaves three courses, not six.
import type { CourseDoc } from "../types/index";

export const COURSES: CourseDoc[] = [
  {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    code: "ITELECT3",
    title: "IT Elective 3",
    units: 3,
    semester: "2nd Semester 2025-2026",
  },
  {
    code: "CSSWENG",
    title: "Software Engineering",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
];