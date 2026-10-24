


import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest, JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export function protect(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized -- send a Bearer token" });
    return;
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    (req as AuthenticatedRequest).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
    return;
  }
}