"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SignupData {
  first_name: string;
  last_name: string;
  username: string;
  suffix?: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default async function SignupFormActions(data: SignupData) {
  const supabase = await createClient();

  if (data.password !== data.confirm_password) {
    throw new Error("Passwords do not match");
  }

  const { data: userData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        suffix: data.suffix || null,
      },
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  redirect("/auth/check-email");
}
