import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — npm trend",
  description: "Set a new password for your npm trend account.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
