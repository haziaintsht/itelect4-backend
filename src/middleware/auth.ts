import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import type { AuthenticatedRequest, JwtPayload, UserRole } from "../types";

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

export function requireRole(role: UserRole) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById((req as AuthenticatedRequest).userId).select("role");

    if (!user) {
      res.status(401).json({ message: "This account no longer exists" });
      return;
    }

    if (user.role !== role) {
      res.status(403).json({ message: `Only ${role}s can do this` });
      return;
    }

    next();
  };
}
