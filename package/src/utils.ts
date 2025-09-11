import type { LayoutgridProps, Breakpoint } from "./types";

export function prepareGridData(props: LayoutgridProps) {
  const {
    desktopColumns = 12,
    tabletColumns = 8,
    mobileColumns = 4,
    gutter = [0.75, 1, 1],
    margin = [0.75, 1, 1],
    gridColor = "#ff0000",
    gridOpacity = 0.1,
    maxWidth = "100vw",
    showBackground = false,
    tabletBreakpoint = 768,
    desktopBreakpoint = 1024,
  } = props;

  const gutterArray = Array.isArray(gutter) ? gutter : [gutter, gutter, gutter];
  const marginArray = Array.isArray(margin) ? margin : [margin, margin, margin];

  return {
    mobileColumns,
    tabletColumns,
    desktopColumns,
    tabletBreakpoint,
    desktopBreakpoint,
    gutterArray,
    marginArray,
    gridColor,
    gridOpacity,
    maxWidth,
    showBackground,
  };
}

/**
 * Determines the current breakpoint based on window width
 */
export function getBreakpoint(
  width: number,
  tabletBreakpoint: number,
  desktopBreakpoint: number,
): Breakpoint {
  if (width >= desktopBreakpoint) return "desktop";
  if (width >= tabletBreakpoint) return "tablet";
  return "mobile";
}

/**
 * Gets the array index for the current breakpoint (0: mobile, 1: tablet, 2: desktop)
 */
export function getBreakpointIndex(breakpoint: Breakpoint): number {
  switch (breakpoint) {
    case "desktop":
      return 2;
    case "tablet":
      return 1;
    default:
      return 0; // mobile
  }
}

/**
 * Creates a grid column element with the specified styling
 */
export function createGridColumn(
  color: string,
  opacity: number,
  showBackground: boolean,
): HTMLElement {
  const column = document.createElement("div");
  column.className = "grid-column";
  Object.assign(column.style, {
    borderInline: `1px solid ${color}`,
    boxSizing: "border-box",
    backgroundColor: showBackground ? color : "transparent",
    opacity: showBackground ? opacity.toString() : "1",
  });
  return column;
}

/**
 * Checks if the keyboard event matches the grid toggle shortcut (Cmd/Ctrl + Shift + G)
 */
export function isGridToggleShortcut(event: KeyboardEvent): boolean {
  return (
    (event.metaKey || event.ctrlKey) && event.shiftKey && event.code === "KeyG"
  );
}
