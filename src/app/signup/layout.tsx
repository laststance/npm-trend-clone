import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — npm trend",
  description:
    "Create an npm trend account to save presets and sync your package comparisons across devices.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
