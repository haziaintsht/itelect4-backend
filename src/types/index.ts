// src/types/index.ts
// The ONE types file for the API. It starts as a copy of YOUR Session 1
// types file (itelect4-project/.../src/types/index.ts) -- same three enums,
// same three core interfaces, same aliases -- so the frontend and the
// backend can never disagree about the shape of a User, Session or Booking.
// On top of that sit the two Express-only shapes the API needs: the JWT
// payload and the request that has passed the auth middleware.
import type { Request } from "express";

// ===== ENUMS (Session 1) =====
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

// ===== INTERFACES -- the 3 core entities (Session 1) =====
// NOTE: these describe what the CLIENT sees. The Mongoose documents in
// src/models/ (IUser, ISession, IBooking) are the server-side shapes --
// numeric ids become ObjectIds and `tuteeId`/`tutorId` become references.
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  skills: string[];
  isActive: boolean;
}

export interface Session {
  id: number;
  title: string;
  subject: string;
  description: string;
  tutorId: number;
  tuteeId?: number;
  status: BookingStatus;
  createdAt: Date;
  sessionType: SessionType;
  meetingLink: string;
}

export interface Booking {
  id: number;
  sessionId: number;
  tuteeId: number;
  tutorId: number;
  status: BookingStatus;
  requestedAt: Date;
  note: string;
}

// ===== TYPE ALIASES & UNIONS (Session 1) =====
export type ID = number | string;
export type StringOrNumber = string | number;

// ===== GENERIC INTERFACE (Session 1) =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES (Session 1) =====
export type SessionUpdate = Partial<Session>;
export type PublicTutorView = Omit<User, "email">;
export type StatusCounts = Record<BookingStatus, number>;

// ===== API SHAPES (backend-only, not from Session 1) =====
// What the protect middleware proves about the token's owner.
export interface JwtPayload {
  userId: string;
}

// A Request that has passed the JWT gate (userId is attached by middleware).
export interface AuthenticatedRequest extends Request {
  userId: string;
}

// ===== COURSE (reference data, public) =====
// The frontend reads courses; nobody creates one through the API, so
// there is no POST route -- just a list and a single lookup.
export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

// Mongoose only ever sees CourseDoc, never Course. Pick produces a
// mapped type, which toJSON's Record<string, unknown> accepts happily.
export type CourseDoc = Pick<
  Course,
  "code" | "title" | "units" | "semester"
>;