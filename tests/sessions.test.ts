import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { User } from "../src/models/User";

vi.mock("../src/config/db", () => ({
  connectDB: async () => {},
}));

function tokenFor(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "5m" });
}

function mockUserWithRole(role: string): void {
  vi.spyOn(User, "findById").mockReturnValue({
    select: async () => ({ role }),
  } as never);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/sessions", () => {
  it("answers 401 when there is no token", async () => {
    const res = await request(app).post("/api/sessions").send({});

    expect(res.status).toBe(401);
  });

  it("answers 403 when the account is a tutee", async () => {
    mockUserWithRole("tutee");

    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${tokenFor("a-tutee")}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Only tutors can do this");
  });

  it("lets a tutor through, then checks the body", async () => {
    mockUserWithRole("tutor");

    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${tokenFor("a-tutor")}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("title, subject and description are required");
  });
});
