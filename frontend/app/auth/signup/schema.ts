import z from "zod";

export const signUpFormSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  username: z.string().min(1, "Required"),
  suffix: z.string().min(0, "Required"),
  email: z.email("Invalid email address").min(1, "Required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirm_password: z.string().min(8, "Password must be at least 8 characters long")
}).superRefine(({ confirm_password, password }, ctx) => {
  if (confirm_password !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirm_password']
    });
  }
});