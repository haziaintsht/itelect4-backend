import type { Request, Response } from "express";
import { SessionModel } from "../models/Session";
import type { AuthenticatedRequest } from "../types";

export async function listSessions(
  _req: Request,
  res: Response
): Promise<void> {
  const sessions = await SessionModel.find().populate("tutor", "name email");
  res.json(sessions);
}

export async function getSession(
  req: Request,
  res: Response
): Promise<void> {
  const session = await SessionModel.findById(req.params.id).populate(
    "tutor",
    "name email"
  );
  if (!session) {
    res.status(404).json({ message: "Session not found" });
    return;
  }
  res.json(session);
}

export async function createSession(
  req: Request,
  res: Response
): Promise<void> {
  const { title, subject, description, sessionType, meetingLink } =
    req.body as {
      title?: string;
      subject?: string;
      description?: string;
      sessionType?: string;
      meetingLink?: string;
    };

  if (!title || !subject || !description) {
    res
      .status(400)
      .json({ message: "title, subject and description are required" });
    return;
  }

  const userId = (req as AuthenticatedRequest).userId;
  const session = await SessionModel.create({
    title,
    subject,
    description,
    tutor: userId,
    sessionType,
    meetingLink,
  });

  res.status(201).json(session);
}
