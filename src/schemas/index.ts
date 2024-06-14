import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(6, { message: "Minimum password is 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Category Name is required" }),
});
