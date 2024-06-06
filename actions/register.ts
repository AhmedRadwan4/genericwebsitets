"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "../src/schemas";
import { db } from "../src/lib/db";
import { getUserByEmail } from "../data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }
  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists" };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return {
    success: "Email sent!",
  };
};
