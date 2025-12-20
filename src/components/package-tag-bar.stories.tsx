import type { Meta, StoryObj } from "@storybook/react";
import { PackageTagBar } from "./package-tag-bar";
import { CHART_COLORS } from "@/constants/colors";

/**
 * PackageTagBar displays a row of PackageTags for all selected packages.
 * Tags are arranged with flex-wrap for responsive layouts.
 */
const meta: Meta<typeof PackageTagBar> = {
  title: "Components/PackageTagBar",
  component: PackageTagBar,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0f0f0f" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onRemovePackage: { action: "removed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty state when no packages are selected.
 */
export const Empty: Story = {
  args: {
    packages: [],
  },
};

/**
 * Single package selected.
 */
export const SinglePackage: Story = {
  args: {
    packages: [{ name: "react", color: CHART_COLORS[0] }],
  },
};

/**
 * Multiple packages - typical comparison view.
 */
export const MultiplePackages: Story = {
  args: {
    packages: [
      { name: "react", color: CHART_COLORS[0] },
      { name: "vue", color: CHART_COLORS[1] },
      { name: "@angular/core", color: CHART_COLORS[2] },
    ],
  },
};

/**
 * Maximum packages (6) - showing all available colors.
 */
export const MaximumPackages: Story = {
  args: {
    packages: [
      { name: "react", color: CHART_COLORS[0] },
      { name: "vue", color: CHART_COLORS[1] },
      { name: "@angular/core", color: CHART_COLORS[2] },
      { name: "svelte", color: CHART_COLORS[3] },
      { name: "solid-js", color: CHART_COLORS[4] },
      { name: "preact", color: CHART_COLORS[5] },
    ],
  },
};
