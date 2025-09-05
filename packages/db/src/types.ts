import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password should contain atleast 6 characters.",
  }),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be atleast 2 characters",
  }),
  email: z.email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password should contain atleast 6 characters.",
  }),
});
