import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, "8 or more characters required")
    .max(255, "255 or less characters required"),
});