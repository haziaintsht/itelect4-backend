// src/types.ts
// Shared types for the API -- mirrors the frontend's src/types/index.ts
// (the three enums live on BOTH sides so the values can never disagree),
// plus the two Express-specific shapes: the JWT payload and the authed request.
import type { Request } from "express";

export enum UserRole {
  TUTOR = "tutor",
  TUTEE = "tutee",
}

export enum BookingStatus {
  REQUESTED = "requested",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
}

export enum SessionType {
  ONE_ON_ONE = "one-on-one",
  GROUP = "group",
}

// What the protect middleware proves about the token's owner.
export interface JwtPayload {
  userId: string;
}

// A Request that has passed the JWT gate (userId is attached by middleware).
export interface AuthenticatedRequest extends Request {
  userId: string;
}