"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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
import { Progress } from "@/components/ui/progress";

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
 * Password strength criteria.
 */
interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

/**
 * Evaluates password strength.
 * @param password - Password to evaluate
 * @returns Criteria met and strength score
 */
function evaluatePasswordStrength(password: string): {
  criteria: PasswordCriteria;
  score: number;
  label: string;
} {
  const criteria: PasswordCriteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  let label = "Very weak";
  if (score >= 5) label = "Strong";
  else if (score >= 4) label = "Good";
  else if (score >= 3) label = "Fair";
  else if (score >= 2) label = "Weak";

  return { criteria, score, label };
}

/**
 * Signup page component.
 * Provides email/password registration with client-side validation.
 * Includes password strength indicator and confirmation matching.
 */
export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Password strength evaluation.
   */
  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  /**
   * Validates the signup form.
   * @returns True if form is valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      const result = await signup(name.trim(), email.trim(), password);

      if (result.success) {
        toast.success("Account created!", {
          description: "Check your email to verify your account",
        });
        router.push("/");
      } else {
        toast.error("Sign up failed", {
          description: result.error ?? "Could not create account",
        });
      }

      setIsLoading(false);
    },
    [validateForm, name, email, password, signup, router]
  );

  const handleOAuthSignup = useCallback(
    async (provider: "github") => {
      setIsLoading(true);
      try {
        const { error } = await authClient.signIn.social({
          provider,
          callbackURL: "/",
        });

        if (error) {
          toast.error("OAuth sign-up failed", {
            description: error.message || "Please try again",
          });
        }
        // On success, the user will be redirected by Better Auth
      } catch {
        toast.error("OAuth sign-up failed", {
          description: "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Renders password strength indicator.
   */
  const strengthColor =
    passwordStrength.score >= 4
      ? "bg-green-500"
      : passwordStrength.score >= 3
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={isLoading}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

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
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div id="password-strength" className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(passwordStrength.score / 5) * 100}
                      className={`h-2 ${strengthColor}`}
                    />
                    <span className="text-xs text-muted-foreground min-w-[60px]">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-1">
                      {passwordStrength.criteria.minLength ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passwordStrength.criteria.minLength
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      {passwordStrength.criteria.hasUppercase ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passwordStrength.criteria.hasUppercase
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        One uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      {passwordStrength.criteria.hasLowercase ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passwordStrength.criteria.hasLowercase
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        One lowercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      {passwordStrength.criteria.hasNumber ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passwordStrength.criteria.hasNumber
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        One number
                      </span>
                    </li>
                    <li className="flex items-center gap-1">
                      {passwordStrength.criteria.hasSpecial ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passwordStrength.criteria.hasSpecial
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        One special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                  }}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-password-error" : undefined
                  }
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
              {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignup("github")}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
