import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05060F] font-sans">
      <div className="flex w-full max-w-4xl rounded-[5px] border border-[#343434] bg-white/5 overflow-hidden">        
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-[36px] font-semibold text-white mb-1">
              Welcome back
            </h1>
            <p className="text-base text-[#8B8888]">
              Login to your SyncTalk account
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base text-white mb-2 block font-geist">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.delacruz@email.com"
                className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password" className="text-base text-white block font-geist">
                  Password
                </Label>
                <a href="/forgot-password" className="text-sm text-[#8B8888] hover:text-white transition-colors font-geist">
                  Forgot Password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
              />
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-[5px] h-10 text-base font-medium mt-4 font-geist">
              Login
            </Button>
          </div>

          <p className="text-center text-sm text-[#8B8888] mt-6 font-geist">
            Don't have an account?{" "}
            <a href="/signup" className="text-white hover:underline">
              Sign up
            </a>
          </p>
        </div>

        <div className="w-1/2">
          <Image
            src="/signup.png" 
            alt="SyncTalk Login Background"
            width={400}
            height={600}
            className="w-full h-full object-cover"
            priority
            loading="eager"
          />
        </div>
      </div>

      <p className="text-center text-sm text-[#8B8888] mt-6 font-geist">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="text-[#8B8888] hover:underline hover:text-white transition-colors">Terms of Service</a> and{" "}
        <a href="/privacy" className="text-[#8B8888] hover:underline hover:text-white transition-colors">Privacy Policy</a>.
      </p>
    </div>
  );
}