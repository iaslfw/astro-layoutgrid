export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface LayoutgridProps {
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  gutter?: number | [number, number, number]; // [mobile, tablet, desktop] in rem
  margin?: number | [number, number, number]; // [mobile, tablet, desktop] in rem
  gridColor?: string;
  gridOpacity?: number;
  maxWidth?: string;
  showBackground?: boolean;
  tabletBreakpoint?: number; // Width in pixels for tablet breakpoint
  desktopBreakpoint?: number; // Width in pixels for desktop breakpoint
}
