import type { Meta, StoryObj } from "@storybook/react";
import { PackageTag } from "./package-tag";
import { CHART_COLORS } from "@/constants/colors";

/**
 * PackageTag displays a colored tag for a selected npm package.
 * It includes a dropdown menu for additional actions and a remove button.
 */
const meta: Meta<typeof PackageTag> = {
  title: "Components/PackageTag",
  component: PackageTag,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0f0f0f" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onRemove: { action: "removed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default package tag with React branding color.
 */
export const Default: Story = {
  args: {
    package: {
      name: "react",
      color: CHART_COLORS[0],
    },
  },
};

/**
 * Vue package with green color.
 */
export const Vue: Story = {
  args: {
    package: {
      name: "vue",
      color: CHART_COLORS[1],
    },
  },
};

/**
 * Angular package with red color.
 */
export const Angular: Story = {
  args: {
    package: {
      name: "@angular/core",
      color: CHART_COLORS[2],
    },
  },
};

/**
 * Package with a long name that gets truncated.
 */
export const LongName: Story = {
  args: {
    package: {
      name: "@typescript-eslint/eslint-plugin",
      color: CHART_COLORS[3],
    },
  },
};

/**
 * Multiple tags displayed together.
 */
export const MultipleTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PackageTag
        package={{ name: "react", color: CHART_COLORS[0] }}
        onRemove={() => {}}
      />
      <PackageTag
        package={{ name: "vue", color: CHART_COLORS[1] }}
        onRemove={() => {}}
      />
      <PackageTag
        package={{ name: "@angular/core", color: CHART_COLORS[2] }}
        onRemove={() => {}}
      />
    </div>
  ),
};
