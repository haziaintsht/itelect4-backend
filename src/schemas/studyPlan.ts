import { z } from "zod";

export const aiRequestSchema = z.object({
  prompt: z
    .string({ error: "prompt is required" })
    .trim()
    .min(20, "Describe what you need help with in at least 20 characters.")
    .max(2000, "Keep it under 2000 characters."),
});

const STUDY_LEVELS = ["beginner", "intermediate", "advanced"] as const;

// The exact shape Gemini must reply with. The descriptions are sent to the
// model as part of the JSON Schema, so they double as field instructions.
export const studyPlanSchema = z.object({
  summary: z
    .string()
    .min(1)
    .describe("One or two sentences restating what the student is struggling with."),
  focusTopics: z
    .array(z.string().min(1))
    .min(1)
    .max(3)
    .describe("The 1 to 3 topics the student should work on first, most important first."),
  level: z
    .enum(STUDY_LEVELS)
    .describe("How far along the student is in this subject, judged from their description."),
  suggestedSubject: z
    .string()
    .min(1)
    .describe("The subject to search sessions for. Use one of the listed subjects when one fits."),
});

export type StudyPlan = z.infer<typeof studyPlanSchema>;

export const studyPlanJsonSchema = z.toJSONSchema(studyPlanSchema);
