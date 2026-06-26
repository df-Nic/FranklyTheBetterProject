// journey.data.ts
// Single source of truth for the journey screen. Node positions are PERCENTAGES
// of the scene image (x = % width, y = % height), measured on the cleaned art.

import type { ImageSourcePropType } from "react-native";

export type MilestoneState = "done" | "current" | "upcoming" | "locked";

export interface Milestone {
  id: string;
  label: string;
  range: string; // display string for the tier's asset band
  x: number;     // % of scene width  (0–100)
  y: number;     // % of scene height (0–100)
  state: MilestoneState;
  size: "sm" | "md" | "lg";
}

// Bottom of the mountain -> summit. "Builder" is the new tier between
// Starter and Grower; its node sits on the right bulge of the path.
export const MILESTONES: Milestone[] = [
  { id: "starter",  label: "Starter",         range: "S$0 – 50K",      x: 40.4, y: 86.4, state: "done",     size: "md" },
  { id: "builder",  label: "Builder",         range: "S$50K – 150K",   x: 53.0, y: 76.5, state: "done",     size: "md" },
  { id: "grower",   label: "Grower",          range: "S$150K – 300K",  x: 44.8, y: 66.6, state: "current",  size: "md" },
  { id: "momentum", label: "Momentum",        range: "S$300K – 350K",  x: 46.7, y: 54.5, state: "upcoming", size: "lg" },
  { id: "premier",  label: "Premier Banking", range: "S$350K – 1.5M",  x: 47.1, y: 40.5, state: "upcoming", size: "lg" },
  { id: "ppc",      label: "PPC",             range: "S$1.5M – 5M",     x: 54.7, y: 28.7, state: "locked",   size: "sm" },
  { id: "bos",      label: "BOS",             range: "S$5M+",           x: 54.7, y: 19.6, state: "locked",   size: "sm" },
];

export interface OwlProduct {
  id: string;
  name: string;
  role: string;
  tint: string; // avatar background tint
  avatar: ImageSourcePropType;
  description: string;
  holdings: number; // amount currently held in this product (SGD)
  cta: string;
}

// Holdings are placeholders — wire these to your real account data.
// (Sum here = S$220,000, which lands the user in the Grower band.)
export const OWLS: OwlProduct[] = [
  {
    id: "deposit",
    name: "Deposit Owl",
    role: "LIQUIDITY MANAGER",
    tint: "#FBF1DE",
    avatar: require("../../assets/owl-deposit.png"),
    description:
      "Optimizing your cash reserves. Monitoring yield opportunities across high-interest accounts and short-term instruments to ensure maximum liquidity return.",
    holdings: 65000,
    cta: "Optimize cash",
  },
  {
    id: "investment",
    name: "Investment Owl",
    role: "PORTFOLIO STRATEGIST",
    tint: "#EBF0FA",
    avatar: require("../../assets/owl-investment.png"),
    description:
      "Analyzing market vectors for growth. Continuously rebalancing your portfolio against institutional benchmarks and emerging sector opportunities.",
    holdings: 135000,
    cta: "Invest now",
  },
  {
    id: "planning",
    name: "Planning Owl",
    role: "FUTURE ARCHITECT",
    tint: "#EAF1E6",
    avatar: require("../../assets/owl-planning.png"),
    description:
      "Mapping your generational wealth trajectory. Forecasting tax implications and structuring long-term estate and budgeting frameworks.",
    holdings: 20000,
    cta: "Plan a goal",
  },
];

// Manual SGD formatter (avoids relying on Intl being present in Hermes).
export function formatSGD(amount: number): string {
  const whole = Math.round(amount).toString();
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `S$${withCommas}`;
}

// Total assets shown on the mascot owl. Derived from holdings so there is one
// source of truth; replace with your real net-worth figure if it differs.
export const TOTAL_ASSETS: number = OWLS.reduce((sum, o) => sum + o.holdings, 0);

export const PALETTE = {
  bg: "#F3EAE3",
  sheet: "#F8F4EF",
  maroon: "#7C2230",
  gold: "#C18A3D",
  ink: "#2B2320",
  sub: "#7A716C",
  ring: "#C9B8A8",
} as const;

// Native aspect ratio of the cleaned scene image (width / height).
export const SCENE_ASPECT = 853 / 958;
