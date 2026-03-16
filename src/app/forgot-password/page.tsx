"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Validates email format.
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Forgot password page component.
 * Allows users to request a password reset email.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Validates the email input.
   * @returns True if email is valid
   */
  const validateEmail = useCallback((): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(null);
    return true;
  }, [email]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail()) {
        return;
      }

      setIsLoading(true);

      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error("Request failed", {
          description: error.message ?? "Could not send reset email",
        });
      } else {
        setIsSubmitted(true);
        toast.success("Reset email sent", {
          description: "Check your inbox for password reset instructions",
        });
      }

      setIsLoading(false);
    },
    [validateEmail, email]
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the email? Check your spam folder or try again
              with a different email address.
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
            >
              Try another email
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you instructions to reset your
            password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
                disabled={isLoading}
              />
              {error && (
                <p id="email-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset instructions"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
