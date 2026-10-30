import { type Request, type Response, Router } from "express";
import { Course } from "../models/Course";

const courseRouter = Router();

courseRouter.get("/", async (_req: Request, res: Response) => {
  const courses = await Course.find().sort({ code: 1 }).lean();
  res.json(courses);
});

courseRouter.get("/:code", async (req: Request, res: Response) => {
  const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
  const course = await Course.findOne({ code: code.toUpperCase() }).lean();

  if (!course) {
    res.status(404).json({ message: `No course with code "${code}"` });
    return;
  }

  res.json(course);
});

export default courseRouter;
