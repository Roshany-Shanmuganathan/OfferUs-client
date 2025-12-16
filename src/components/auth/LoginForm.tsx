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
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
  onSignupClick: () => void;
}

export function LoginForm({ onSuccess, onSignupClick }: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login successful!");
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
            form.setError(err.field as keyof LoginFormData, {
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
            errorMessage || "Login failed. Please check your credentials."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                      disabled={isLoading}
                      className="bg-muted/50 border-border text-foreground focus-visible:ring-1 focus-visible:ring-primary h-10 text-sm pr-10"
                      tabIndex={2}
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

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-border text-primary focus:ring-primary cursor-pointer w-3.5 h-3.5"
                tabIndex={3}
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="hover:underline font-medium cursor-pointer"
              tabIndex={4}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-medium cursor-pointer"
            disabled={isLoading}
            tabIndex={5}
            suppressHydrationWarning
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">
                OR
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none h-10 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-none"
            onClick={() => toast.info("Google login not implemented yet")}
            tabIndex={6}
            suppressHydrationWarning
          >
            <svg
              className="w-4 h-4 bg-white rounded-full p-0.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with google
          </Button>

          <div className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-bold text-foreground hover:underline cursor-pointer"
              tabIndex={7}
              onClick={onSignupClick}
            >
              Sign up
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
