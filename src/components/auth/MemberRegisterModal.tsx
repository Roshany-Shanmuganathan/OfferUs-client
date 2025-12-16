"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  memberRegisterSchema,
  type MemberRegisterFormData,
} from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

interface MemberRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick?: () => void;
}

export function MemberRegisterModal({
  open,
  onOpenChange,
  onLoginClick,
}: MemberRegisterModalProps) {
  const { registerMember } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<MemberRegisterFormData>({
    resolver: zodResolver(memberRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      address: "",
      dateOfBirth: "",
      gender: undefined,
      profilePicture: "",
    },
  });

  const onSubmit = async (data: MemberRegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMember(registerData);
      toast.success("Registration successful! Welcome!");
      form.reset();
      onOpenChange(false);
    } catch (error: unknown) {
      // Handle field-specific errors from API
      const apiError = error as ApiError;
      if (
        apiError.response?.data?.errors &&
        Array.isArray(apiError.response.data.errors)
      ) {
        // Set field errors if API returns field-specific errors
        apiError.response.data.errors.forEach(err => {
          if (err.field && err.message) {
            form.setError(err.field as keyof MemberRegisterFormData, {
              message: err.message,
            });
          }
        });
        // Only show toast if there's a general message
        if (apiError.response.data.message) {
          toast.error(apiError.response.data.message);
        }
      } else {
        // Only show toast for general errors, not field-specific ones
        const errorMessage =
          apiError.response?.data?.message || apiError.message;
        if (errorMessage && !errorMessage.includes("validation")) {
          toast.error(
            errorMessage ||
              "Registration failed. Please check the form and try again."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-background">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Form */}
          <div className="p-8 md:p-12 bg-background">
            <DialogHeader className="mb-8 text-center md:text-left">
              <DialogTitle className="text-4xl md:text-5xl font-extrabold text-center text-foreground">
                Sign up
              </DialogTitle>
              <DialogDescription className="hidden">
                Create your account
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          disabled={isLoading}
                          className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-12"
                          tabIndex={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          {...field}
                          disabled={isLoading}
                          className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-12"
                          tabIndex={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                            disabled={isLoading}
                            className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-12 pr-10"
                            tabIndex={3}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...field}
                            disabled={isLoading}
                            className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-12 pr-10"
                            tabIndex={4}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium cursor-pointer mt-4"
                  disabled={isLoading}
                  tabIndex={5}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center text-xs text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-bold text-foreground hover:underline cursor-pointer"
                    tabIndex={6}
                    onClick={() => {
                      if (onLoginClick) {
                        onLoginClick();
                      } else {
                        onOpenChange(false);
                        toast.info("Please open the login modal");
                      }
                    }}
                  >
                    Log in
                  </button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Side - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center bg-primary text-primary-foreground p-10 relative">
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              <div className="text-center">
                <div className="relative w-48 h-32 lg:w-64 lg:h-40 mb-0">
                  <Image
                    src="/assets/logo-light.png"
                    alt="OfferUs Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-medium">Join us today.</h2>
                <p className="text-base text-primary-foreground/70">
                  Create an account to start saving
                </p>
              </div>

              <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-[var(--color-gold)] [mask-image:url(/assets/login-offer-icon.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]">
                {/* Icon rendered via mask to apply color */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
