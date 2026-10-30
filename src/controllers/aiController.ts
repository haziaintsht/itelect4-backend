import type { Request, Response } from "express";
import { ApiError } from "@google/genai";
import { AiReplyError, generateStudyPlan } from "../ai/gemini";
import { SessionModel } from "../models/Session";
import { aiRequestSchema } from "../schemas/studyPlan";

export async function createStudyPlan(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  // The subjects that have sessions, so Gemini can point at one that exists.
  const subjects = await SessionModel.distinct("subject");

  try {
    const plan = await generateStudyPlan(parsed.data.prompt, subjects);
    res.json(plan);
  } catch (err) {
    if (err instanceof AiReplyError) {
      console.error(err.message);
      res.status(502).json({ message: "The AI gave an unusable answer. Try again." });
      return;
    }
    if (err instanceof ApiError && err.status === 429) {
      console.error("Gemini quota exhausted:", err.message);
      res.status(429).json({ message: "The AI is out of quota for now. Try again later." });
      return;
    }
    throw err;
  }
}
