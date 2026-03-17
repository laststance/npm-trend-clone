import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email — npm trend",
  description: "Email verification status for your npm trend account.",
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
