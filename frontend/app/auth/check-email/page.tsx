"use client";

import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckEmailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-[#05060F] h-screen">
      <div className="w-full max-w-md">
        <div className="rounded-[5px] border border-[#343434] bg-white/5 p-10 flex flex-col items-center text-center">
          {/* Mail icon */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-[#343434] flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-white/80" />
          </div>

          {/* Heading */}
          <h1 className="text-[28px] font-medium text-white tracking-tight mb-2 font-geist">
            Check your email
          </h1>

          {/* Description */}
          <p className="text-sm text-[#8B8888] leading-relaxed mb-8 font-geist max-w-xs">
            We&apos;ve sent a confirmation link to your email address. Please
            click the link to verify your account and get started.
          </p>

          {/* Divider */}
          <div className="w-full border-t border-[#343434] mb-6" />

          {/* Help text */}
          <p className="text-xs text-[#6B7280] mb-6 font-geist">
            Didn&apos;t receive the email? Check your spam folder or try signing
            up again.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-white text-black hover:bg-white/90 rounded-[5px] h-10 text-sm font-medium font-geist"
            >
              Go to Login
            </Button>

            <Button
              onClick={() => router.push("/auth/signup")}
              variant="outline"
              className="w-full bg-transparent border-[#343434] text-[#8B8888] hover:text-white hover:border-white/30 rounded-[5px] h-10 text-sm font-medium font-geist"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#8B8888] mt-6 font-geist">
          By clicking continue, you agree to our{" "}
          <a
            href="/terms"
            className="text-[#8B8888] hover:underline hover:text-white transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-[#8B8888] hover:underline hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
