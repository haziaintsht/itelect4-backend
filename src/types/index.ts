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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  skills: string[];
  isActive: boolean;
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  description: string;
  tutorId: string;
  tuteeId?: string;
  status: BookingStatus;
  createdAt: Date;
  sessionType: SessionType;
  meetingLink: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  tuteeId: string;
  tutorId: string;
  status: BookingStatus;
  requestedAt: Date;
  note: string;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export type SessionSeed = Pick<
  Session,
  "title" | "subject" | "description" | "status" | "sessionType" | "meetingLink"
>;

export type CourseSeed = Pick<Course, "code" | "title" | "units" | "semester">;
