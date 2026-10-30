import { GoogleGenAI } from "@google/genai";
import { EXAMPLES, EXAMPLE_SUBJECTS, SYSTEM_PROMPT, wrap } from "./prompt";
import {
  studyPlanJsonSchema,
  studyPlanSchema,
  type StudyPlan,
} from "../schemas/studyPlan";

// Thrown when Gemini answers, but not with a study plan we can use.
// The route turns it into a 502 Bad Gateway.
export class AiReplyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiReplyError";
  }
}

let client: GoogleGenAI | null = null;

export function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Set it in .env (local) or in Vercel's Environment Variables (deployed).",
    );
  }

  if (client === null) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
}

export async function generateStudyPlan(
  prompt: string,
  subjects: string[],
): Promise<StudyPlan> {
  const response = await getClient().models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    contents: [
      ...EXAMPLES.flatMap((example) => [
        { role: "user", parts: [{ text: wrap(example.input, EXAMPLE_SUBJECTS) }] },
        { role: "model", parts: [{ text: JSON.stringify(example.output) }] },
      ]),
      { role: "user", parts: [{ text: wrap(prompt, subjects) }] },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: studyPlanJsonSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new AiReplyError("Gemini returned an empty reply");
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new AiReplyError("Gemini did not reply with JSON");
  }

  const result = studyPlanSchema.safeParse(json);
  if (!result.success) {
    throw new AiReplyError("Gemini's reply did not match the study plan schema");
  }

  return result.data;
}
