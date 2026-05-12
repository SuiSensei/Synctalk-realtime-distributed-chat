"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

export default async function LoginFormActions(data: LoginData) {
  const supabase = await createClient();

  const { data: userData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (signInError) {
    throw new Error(signInError.message);
  }

  if (!userData.user) {
    throw new Error("User data not available");
  }

  redirect("/main");
}
