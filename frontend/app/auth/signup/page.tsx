"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SignupFormActions from "./action";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { signUpFormSchema } from "./schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [isSignUpInProgress, setIsSignUpInProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateMutation = useMutation({
    mutationFn: SignupFormActions,
    onSuccess: () => {
      setIsSignUpInProgress(false);
      toast.success("Sign-up successful!");
      router.push("/main");
    },
    onError: (err) => {
      setIsSignUpInProgress(false);
      toast.error(
        `Sign-up failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      suffix: "",
    },
    validators: {
      onSubmit: signUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSignUpInProgress(true);
      updateMutation.mutate(value);
    },
    onSubmitInvalid: (data) => {
      console.log("Validation errors:", data.formApi.getAllErrors());
    },
  });

  return (
    <div className="flex flex-col items-center justify-center bg-[#05060F] h-screen">
      <div>
        <div className="flex w-full max-w-4xl rounded-[5px] border border-[#343434] bg-card overflow-hidden">
          <div className="w-1/2 p-8">
            <h1 className="text-[36px] font-semibold text-foreground">
              Create an Account
            </h1>
            <p className="text-base text-muted mb-8">
              Enter your information below to create your account
            </p>

            <form
              id="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <form.Field name="first_name">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor="first_name"
                              className=" text-white font-geist"
                            >
                              First Name
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
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
                  <FieldGroup>
                    <form.Field name="username">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor="username"
                              className=" text-white font-geist"
                            >
                              Username
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <form.Field name="last_name">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor="last_name"
                              className=" text-white font-geist"
                            >
                              Last Name
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
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
                  <FieldGroup>
                    <form.Field name="suffix">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              htmlFor="suffix"
                              className=" text-white font-geist"
                            >
                              Suffix
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
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
                </div>
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
                            className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
                          />
                          <FieldDescription>
                            We'll use this to contact you. We will not share
                            your email with anyone else.
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
                <FieldGroup>
                  <form.Field name="password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor="password"
                            className=" text-white font-geist"
                          >
                            Password
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
                          />
                          <FieldDescription>
                            Must be at least 8 characters long.
                          </FieldDescription>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
                <FieldGroup>
                  <form.Field name="confirm_password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel
                            htmlFor="confirm_password"
                            className=" text-white font-geist"
                          >
                            Confirm Password
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            className="bg-transparent border-[#343434] text-white placeholder:text-[#8B8888] rounded-[5px] font-geist"
                          />
                          <FieldDescription>
                            Must be equal to the password field.
                          </FieldDescription>
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
                  disabled={isSignUpInProgress}
                  type="submit"
                  form="signup-form"
                >
                  {isSignUpInProgress ? (
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

            <p className="text-center text-sm text-muted mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-foreground hover:underline"
              >
                Login
              </Link>
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
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
