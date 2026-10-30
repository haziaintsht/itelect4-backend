import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

vi.mock("../src/config/db", () => ({
  connectDB: async () => {},
}));

const VALID_PROMPT = "I keep getting derivatives wrong before my exam.";

function tokenFor(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "5m" });
}

describe("POST /api/ai", () => {
  it("answers 401 when there is no token", async () => {
    const res = await request(app).post("/api/ai").send({ prompt: VALID_PROMPT });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized -- send a Bearer token");
  });

  it("answers 401 when the token was signed with another secret", async () => {
    const forged = jwt.sign({ userId: "someone" }, "not-the-secret");

    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${forged}`)
      .send({ prompt: VALID_PROMPT });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token invalid or expired");
  });

  it("lets a valid token through, then checks the body", async () => {
    // Too short for aiRequestSchema, so auth passes but Gemini is never called.
    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${tokenFor("valid-token-user")}`)
      .send({ prompt: "Too short" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      "Describe what you need help with in at least 20 characters.",
    ]);
  });

  it("answers 429 on the sixth request in a minute from one account", async () => {
    const token = tokenFor("rate-limited-user");
    const statuses: number[] = [];

    for (let i = 0; i < 6; i++) {
      const res = await request(app)
        .post("/api/ai")
        .set("Authorization", `Bearer ${token}`)
        .send({ prompt: "Too short" });
      statuses.push(res.status);
    }

    expect(statuses).toEqual([400, 400, 400, 400, 400, 429]);
  });
});
