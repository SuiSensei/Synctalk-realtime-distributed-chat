"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import LoginFormActions from "./actions";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { LoginFormSchema } from "./schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();

  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateMutation = useMutation({
    mutationFn: LoginFormActions,
    onSuccess: () => {
      setIsLoginInProgress(false);
      toast.success("Login successful!");
      router.push("/main");
    },
    onError: (err) => {
      setIsLoginInProgress(false);
      toast.error(
        `Login failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoginInProgress(true);
      updateMutation.mutate(value);
    },
    onSubmitInvalid: (data) => {
      console.log("Validation errors:", data.formApi.getAllErrors());
    },
  });

  return (
    <div className="flex flex-col items-center justify-center bg-[#05060F] h-screen">
      <div>
        <div className="flex w-full max-w-4xl rounded-[5px] border border-[#343434] bg-white/5 overflow-hidden">
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-[36px] font-medium text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-base">Login to your SyncTalk account</p>
            </div>
            <form
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="space-y-6">
                <FieldGroup>
                  <form.Field name="email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor="email"
                            className=" text-white font-geist"
                          >
                            Email
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="juan.delacruz@email.com"
                            className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                  <form.Field name="password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <div className="flex justify-between items-center">
                            <FieldLabel
                              htmlFor="password"
                              className=" text-white font-geist"
                            >
                              Password
                            </FieldLabel>
                            <a
                              href="/forgot-password"
                              className="text-sm text-[#8B8888] hover:text-white transition-colors font-geist"
                            >
                              Forgot Password?
                            </a>
                          </div>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>

                <Button
                  className="w-full bg-white text-black hover:bg-white/90 rounded-[5px] h-10 text-base font-medium mt-4 font-geist"
                  disabled={isLoginInProgress}
                  type="submit"
                  form="login-form"
                >
                  {isLoginInProgress ? (
                    <>
                      <Spinner />
                      <p>Submitting</p>
                    </>
                  ) : (
                    <p>Submit</p>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-[#8B8888] mt-6 font-geist">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-white hover:underline">
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
              className="w-full object-cover"
              priority
              loading="eager"
            />
          </div>
        </div>
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
