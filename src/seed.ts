import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { SessionModel } from "./models/Session";
import { Course } from "./models/Course";
import { SESSIONS } from "./data/sessions";
import { COURSES } from "./data/courses";
import { UserRole } from "./types/index";

async function seed(): Promise<void> {
  const email = process.env.SEED_TUTOR_EMAIL?.toLowerCase();
  const password = process.env.SEED_TUTOR_PASSWORD;

  if (!email) {
    throw new Error("SEED_TUTOR_EMAIL is missing. Add it to .env.");
  }

  await connectDB();

  let tutor = await User.findOne({ email });

  if (!tutor) {
    if (!password) {
      throw new Error(
        "SEED_TUTOR_PASSWORD is missing. Add it to .env -- it is only needed the first time.",
      );
    }
    tutor = await User.create({
      name: "Mina Santos",
      email,
      password,
      role: UserRole.TUTOR,
      bio: "Calculus and coding mentor",
      skills: ["Calculus", "TypeScript"],
    });
  }

  for (const session of SESSIONS) {
    await SessionModel.updateOne(
      { title: session.title, tutor: tutor._id },
      { ...session, tutor: tutor._id },
      { upsert: true, runValidators: true },
    );
  }

  console.log(
    `${SESSIONS.length} sessions for ${tutor.name} in ${mongoose.connection.name}`,
  );

  for (const course of COURSES) {
    await Course.updateOne(
      { code: course.code },
      { ...course },
      { upsert: true, runValidators: true },
    );
  }
  console.log(`${COURSES.length} courses in ${mongoose.connection.name}`);

  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
