"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
  redirectUrl?: string;
}

export function RegisterForm({ onSuccess, onLoginClick, redirectUrl }: RegisterFormProps) {
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
      await registerMember(registerData, redirectUrl);
      toast.success("Registration successful! Welcome!");
      form.reset();
      onSuccess();
    } catch (error: unknown) {
      // Handle field-specific errors from API
      const apiError = error as ApiError;
      if (
        apiError.response?.data?.errors &&
        Array.isArray(apiError.response.data.errors)
      ) {
        // Set field errors if API returns field-specific errors
        apiError.response.data.errors.forEach((err) => {
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
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl font-bold text-foreground">Sign up</h2>
        <p className="text-sm text-muted-foreground mt-1">Create your account</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
          noValidate
        >
          <div className="grid grid-cols-2 gap-3">
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
                      className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm"
                      tabIndex={1}
                      suppressHydrationWarning
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      {...field}
                      disabled={isLoading}
                      className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm"
                      tabIndex={2}
                      suppressHydrationWarning
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm"
                    tabIndex={3}
                    suppressHydrationWarning
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
                      className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm pr-10"
                      tabIndex={4}
                      suppressHydrationWarning
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
                      className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm pr-10"
                      tabIndex={5}
                      suppressHydrationWarning
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-medium cursor-pointer mt-2"
            disabled={isLoading}
            tabIndex={6}
            suppressHydrationWarning
          >
             {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground mt-4">
            Already have an account?{" "}
            <button
              type="button"
              className="font-bold text-foreground hover:underline cursor-pointer"
              tabIndex={7}
              onClick={onLoginClick}
            >
              Log in
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
