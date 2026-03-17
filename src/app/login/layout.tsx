import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — npm trend",
  description:
    "Sign in to your npm trend account to save presets and sync your package comparisons.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
