"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/main");
      } else {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05060F] flex flex-col items-center justify-center w-full">
      {isChecking && (
        <Loader2 className="w-8 h-8 text-[#9CA3AF] animate-spin" />
      )}
    </div>
  );
}