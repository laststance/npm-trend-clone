import type { Meta, StoryObj } from "@storybook/react";
import { TrendChart } from "./trend-chart";
import { CHART_COLORS } from "@/constants/colors";
import type { ChartDataPoint, SelectedPackage } from "@/types/package";

/**
 * Generates mock chart data for stories.
 */
function generateMockData(packages: string[]): ChartDataPoint[] {
  if (packages.length === 0) return [];

  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i -= 7) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const point: ChartDataPoint = { date: dateStr };
    packages.forEach((pkg, index) => {
      const baseDownloads = (index + 1) * 1_000_000;
      const variation = Math.sin(i / 30) * 200_000;
      const trend = (365 - i) * 5000;
      point[pkg] = Math.max(0, Math.round(baseDownloads + variation + trend));
    });

    data.push(point);
  }

  return data;
}

/**
 * TrendChart displays a time-series line chart of npm package download statistics.
 * Built with Recharts for responsive, interactive visualizations.
 */
const meta: Meta<typeof TrendChart> = {
  title: "Components/TrendChart",
  component: TrendChart,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0f0f0f" }],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const singlePackage: SelectedPackage[] = [
  { name: "react", color: CHART_COLORS[0] },
];

const twoPackages: SelectedPackage[] = [
  { name: "react", color: CHART_COLORS[0] },
  { name: "vue", color: CHART_COLORS[1] },
];

const multiplePackages: SelectedPackage[] = [
  { name: "react", color: CHART_COLORS[0] },
  { name: "vue", color: CHART_COLORS[1] },
  { name: "@angular/core", color: CHART_COLORS[2] },
  { name: "svelte", color: CHART_COLORS[3] },
];

/**
 * Empty state when no packages are selected.
 */
export const Empty: Story = {
  args: {
    data: [],
    packages: [],
    isLoading: false,
  },
};

/**
 * Loading state while fetching data.
 */
export const Loading: Story = {
  args: {
    data: [],
    packages: twoPackages,
    isLoading: true,
  },
};

/**
 * Single package trend visualization.
 */
export const SinglePackage: Story = {
  args: {
    data: generateMockData(["react"]),
    packages: singlePackage,
    isLoading: false,
  },
};

/**
 * Comparing two packages (React vs Vue).
 */
export const TwoPackages: Story = {
  args: {
    data: generateMockData(["react", "vue"]),
    packages: twoPackages,
    isLoading: false,
  },
};

/**
 * Multiple packages comparison view.
 */
export const MultiplePackages: Story = {
  args: {
    data: generateMockData(["react", "vue", "@angular/core", "svelte"]),
    packages: multiplePackages,
    isLoading: false,
  },
};
