// src/routes/courses.ts
// Public routes -- no requireAuth. The course list is what the app
// shows before anybody has logged in, so these two are public on purpose.
import { Router, type Request, type Response } from "express";
import { Course } from "../models/Course";

const courseRouter = Router();

export default courseRouter;
courseRouter.get("/", async (_req: Request, res: Response) => {
  const courses = await Course.find().sort({ code: 1 });
  res.json(courses);
});

// GET /api/courses/:code
courseRouter.get(
  "/:code",
  async (req: Request, res: Response) => {
    // The schema uppercases code on the way in, so /courses/itelect4
    // has to be raised here too or it matches nothing.
    const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
    const course = await Course.findOne({
      code: code.toUpperCase(),
    });

    if (!course) {
      res.status(404).json({
        message: `No course with code "${code}"`,
      });
      return;
    }

    res.json(course);
  },
);