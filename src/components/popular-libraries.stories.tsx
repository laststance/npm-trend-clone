import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { PopularLibraries } from "./popular-libraries";

/**
 * PopularLibraries displays a curated list of popular npm packages
 * that users can click to quickly add to their comparison.
 * Already selected packages are visually muted and disabled.
 */
const meta: Meta<typeof PopularLibraries> = {
  title: "Components/PopularLibraries",
  component: PopularLibraries,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSelectPackage: { action: "selected" },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px] p-4 bg-background rounded-lg border border-border">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with no packages selected.
 * All packages are clickable.
 */
export const Default: Story = {
  args: {
    selectedPackages: [],
  },
};

/**
 * Some packages already selected.
 * Selected packages appear muted and have strikethrough.
 */
export const WithSelectedPackages: Story = {
  args: {
    selectedPackages: ["react", "vue", "express"],
  },
};

/**
 * All packages selected.
 * Demonstrates the disabled state for all items.
 */
export const AllSelected: Story = {
  args: {
    selectedPackages: [
      "react",
      "lodash",
      "react-dom",
      "axios",
      "chalk",
      "tslib",
      "commander",
      "inquirer",
      "express",
      "vue",
    ],
  },
};

/**
 * Interactive example showing the selection flow.
 * Click packages to add them to the selection.
 */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [selected, setSelected] = useState<string[]>(["react"]);

    const handleSelect = (name: string) => {
      setSelected((prev) => [...prev, name]);
    };

    return (
      <div className="flex flex-col gap-4">
        <PopularLibraries
          onSelectPackage={handleSelect}
          selectedPackages={selected}
        />
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          <strong>Selected:</strong>{" "}
          {selected.length > 0 ? selected.join(", ") : "None"}
        </div>
      </div>
    );
  },
};

/**
 * Dark theme variant.
 */
export const DarkTheme: Story = {
  args: {
    selectedPackages: ["lodash", "axios"],
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <div className="dark w-[280px] p-4 bg-background rounded-lg border border-border">
        <Story />
      </div>
    ),
  ],
};
