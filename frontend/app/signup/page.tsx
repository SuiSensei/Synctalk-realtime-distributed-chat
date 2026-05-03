import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full max-w-4xl rounded-[5px] border border-[#343434] bg-card overflow-hidden">
        <div className="w-1/2 p-8">
          <h1 className="text-[36px] font-semibold text-foreground">
            Create an Account
          </h1>
          <p className="text-base text-muted mb-8">
            Enter your information below to create your account
          </p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="first-name" className="text-base text-foreground mb-2 block">
                First Name
              </Label>
              <Input
                id="first-name"
                placeholder="Juan"
                className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="last-name" className="text-base text-foreground mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  placeholder="dela Cruz"
                  className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
                />
              </div>
              <div>
                <Label htmlFor="suffix" className="text-base text-foreground mb-2 block">
                  Suffix
                </Label>
                <Input
                  id="suffix"
                  placeholder="N/A"
                  className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-base text-foreground mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.delacruz@email.com"
                className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
              />
              <p className="text-sm text-muted mt-2">
                We'll use this to contact you. We will not share your email with anyone else.
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-base text-foreground mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
              />
              <p className="text-sm text-muted mt-2">
                Must be at least 8 characters long.
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="text-base text-foreground mb-2 block">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="bg-transparent border-[#343434] text-foreground placeholder:text-muted"
              />
            </div>

            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-[5px] h-10 text-base font-medium">
              Signup
            </Button>
          </div>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-foreground hover:underline">
              Login
            </a>
          </p>
        </div>

        <div className="w-1/2">
          <Image
            src="/signup.png"
            alt="Signup visual"
            width={400}
            height={600}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      <p className="text-center text-sm text-muted mt-6">
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
