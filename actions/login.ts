"use server";

import * as z from "zod";
import { LoginSchema } from "../src/schemas";
import { signIn } from "@/auth";
import { Default_Login_Redirect } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }
  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: Default_Login_Redirect,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!", success: "" };
        default:
          return { error: "Something went wrong!", success: "" };
      }
    }
    throw error;
  }
};
