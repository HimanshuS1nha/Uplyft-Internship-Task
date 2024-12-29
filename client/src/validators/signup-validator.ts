import { z } from "zod";

export const signupValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, { message: "Please fill in the email field" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1, { message: "Password must be atleast 8 characters long" }),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .trim()
    .min(1, { message: "Confirm Password must be atleast 8 characters long" }),
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
});

export type signupValidatorType = z.infer<typeof signupValidator>;
