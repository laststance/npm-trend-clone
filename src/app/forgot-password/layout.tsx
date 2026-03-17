import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — npm trend",
  description:
    "Request a password reset link for your npm trend account.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
