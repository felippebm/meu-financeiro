import type { SVGProps } from "react";

type IconName =
  | "brand"
  | "chevron-left"
  | "chevron-right"
  | "income"
  | "expense"
  | "balance"
  | "plus"
  | "arrow-up-right"
  | "arrow-down-right"
  | "food"
  | "home"
  | "transport"
  | "leisure"
  | "other";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, string> = {
  brand: "M4 18V9m5 9V5m5 13v-6m5 6V8M3 20h18",
  "chevron-left": "m15 18-6-6 6-6",
  "chevron-right": "m9 18 6-6-6-6",
  income: "M7 17 17 7M7 7h10v10",
  expense: "M7 7 17 17M17 7v10H7",
  balance: "M3 7h18v13H3zM3 7l2-3h14l2 3M16 13h5",
  plus: "M12 5v14m-7-7h14",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "arrow-down-right": "m7 7 10 10M17 7v10H7",
  food: "M7 3v7m4-7v7M7 7h4m-2 3v11m8-18v18m0-18c2 2 3 4 3 7h-3",
  home: "m3 11 9-8 9 8M5 9v12h14V9m-9 12v-7h4v7",
  transport: "M5 11l1.5-5h11l1.5 5m-14 0h14v8H5zm2 8v2m10-2v2M8 15h.01M16 15h.01",
  leisure: "M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z",
  other: "M5 12h.01M12 12h.01M19 12h.01",
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
