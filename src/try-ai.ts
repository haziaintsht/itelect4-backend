import "dotenv/config";
import { generateStudyPlan } from "./ai/gemini";
import { SESSIONS } from "./data/sessions";

const prompt =
  process.argv.slice(2).join(" ") ||
  "I keep getting derivatives wrong, especially the chain rule, and my calculus exam is next week.";

const subjects = [...new Set(SESSIONS.map((session) => session.subject))];

async function main(): Promise<void> {
  console.log(`Asking Gemini about: "${prompt}"\n`);
  const started = Date.now();
  const plan = await generateStudyPlan(prompt, subjects);
  console.log(JSON.stringify(plan, null, 2));
  console.log(`\nAnswered in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});
