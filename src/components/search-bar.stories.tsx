import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "./search-bar";

/**
 * SearchBar provides autocomplete search for npm packages.
 * It fetches suggestions from the npm registry with debouncing.
 */
const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0f0f0f" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onSelectPackage: { action: "selected" },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default search bar in enabled state.
 */
export const Default: Story = {
  args: {
    placeholder: "Search npm packages...",
    disabled: false,
  },
};

/**
 * Search bar when maximum packages have been selected.
 */
export const Disabled: Story = {
  args: {
    placeholder: "Maximum 6 packages reached",
    disabled: true,
  },
};

/**
 * Search bar with custom placeholder text.
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Type to search for packages...",
    disabled: false,
  },
};
