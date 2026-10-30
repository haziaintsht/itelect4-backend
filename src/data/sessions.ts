import { BookingStatus, SessionType, type SessionSeed } from "../types/index";

export const SESSIONS: SessionSeed[] = [
  {
    title: "Calculus Crash Course",
    subject: "Calculus",
    description:
      "Review limits, derivatives, and exam strategy before finals week.",
    status: BookingStatus.REQUESTED,
    sessionType: SessionType.ONE_ON_ONE,
    meetingLink: "https://meet.example.com/calculus",
  },
  {
    title: "TypeScript Debugging Lab",
    subject: "Programming",
    description:
      "Walk through a React + TypeScript bug and improve confidence quickly.",
    status: BookingStatus.CONFIRMED,
    sessionType: SessionType.GROUP,
    meetingLink: "https://meet.example.com/typescript",
  },
];
