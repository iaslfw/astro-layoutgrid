import type { LayoutgridProps, GridData, Breakpoint } from "./types";

/**
 * Prepares and normalizes grid configuration data from component props.
 *
 * This function processes the incoming props for the LayoutGrid component,
 * applying default values and ensuring consistent data structures for
 * responsive grid behavior.
 *
 * @param props - The raw props passed to the LayoutGrid component
 *
 * @returns Normalized grid configuration object with consistent array formats
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const gridConfig = prepareGridData({});
 * // Returns: { mobileColumns: 4, tabletColumns: 8, desktopColumns: 12, ... }
 *
 * // Custom configuration
 * const customConfig = prepareGridData({
 *   desktopColumns: 16,
 *   gutter: [1, 1.5, 2],
 *   gridColor: "#0066cc",
 *   showBackground: true
 * });
 *
 * // Single gutter value (gets normalized to array)
 * const simpleConfig = prepareGridData({ gutter: 1.5 });
 * // Results in gutterArray: [1.5, 1.5, 1.5]
 * ```
 *
 * @since 1.0.0
 */
export function prepareGridData(props: LayoutgridProps): GridData {
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
 * Determines the current responsive breakpoint based on window width.
 *
 * This function evaluates the provided width against the configured breakpoints
 * to determine which layout should be active. It follows a mobile-first approach
 * where smaller breakpoints are the fallback.
 *
 * @param width - The current window width in pixels
 * @param tabletBreakpoint - The minimum width in pixels for tablet layout
 * @param desktopBreakpoint - The minimum width in pixels for desktop layout
 *
 * @returns The appropriate breakpoint identifier
 *
 * @example
 * ```typescript
 * // Standard Tailwind breakpoints
 * const breakpoint1 = getBreakpoint(500, 768, 1024);   // Returns: "mobile"
 * const breakpoint2 = getBreakpoint(800, 768, 1024);   // Returns: "tablet"
 * const breakpoint3 = getBreakpoint(1200, 768, 1024);  // Returns: "desktop"
 *
 * // Custom breakpoints
 * const breakpoint4 = getBreakpoint(900, 600, 1200);   // Returns: "tablet"
 *
 * // Edge case - exactly at breakpoint
 * const breakpoint5 = getBreakpoint(768, 768, 1024);   // Returns: "tablet"
 * ```
 *
 * @remarks
 * The function uses greater-than-or-equal comparison, so a width that exactly
 * matches a breakpoint will trigger that breakpoint's layout.
 *
 * @since 1.0.0
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
 * Converts the breakpoint to indexes.
 *
 * This function turns the provided breakpoints into indices
 * to determine which layout is active. Smaller breakpoints are the
 * fallback
 *
 * @param breakpoint - The active breakpoint based on the viewport-width
 *
 * @returns The appropriate breakpoint identifier
 *
 * @since 1.0.0
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
 * Creates a styled grid column element for the layout grid overlay.
 *
 * This function generates a DOM element representing a single column in the grid
 * system with customizable visual properties. The column includes borders and
 * optional background styling based on the provided parameters.
 *
 * @param color - The color for the column borders and background (CSS color value)
 * @param opacity - The opacity level for the background when showBackground is true (0-1)
 * @param showBackground - Whether to display a colored background fill for the column
 *
 * @returns A configured HTMLElement representing a grid column
 *
 * @example
 * ```typescript
 * // Create a basic red column with border only
 * const borderColumn = createGridColumn("#ff0000", 0.1, false);
 * // Result: <div> with red borders, transparent background
 *
 * // Using with grid container
 * const gridContainer = document.querySelector('.layout-grid');
 * const column = createGridColumn("#333333", 0.1, false);
 * gridContainer?.appendChild(column);
 * ```
 *
 * @remarks
 * The created element has a class name "grid-column" for styling purposes.
 * When showBackground is false, opacity is set to "1" to ensure border visibility.
 * The element uses border-inline for responsive design compatibility.
 *
 * @since 1.0.0
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
 * Determines if a keyboard event matches the grid toggle shortcut combination.
 *
 * This function checks if the provided keyboard event represents the specific
 * key combination used to toggle the layout grid visibility. The shortcut is
 * Cmd/Ctrl + Shift + G, providing a consistent cross-platform experience.
 *
 * @param event - The keyboard event to check for the toggle shortcut
 *
 * @returns True if the event matches the grid toggle shortcut, false otherwise
 *
 * @example
 * ```typescript
 * // Basic usage in event listener
 * document.addEventListener('keydown', (event) => {
 *   if (isGridToggleShortcut(event)) {
 *     toggleGridVisibility();
 *     event.preventDefault();
 *   }
 * });
 *
 * const justG = new KeyboardEvent('keydown', { code: 'KeyG' });
 * console.log(isGridToggleShortcut(justG)); // Returns: false
 * ```
 *
 * @remarks
 * The function uses `event.code` instead of `event.key` to ensure consistent
 * behavior across different keyboard layouts. It supports both Cmd (macOS) and
 * Ctrl (Windows/Linux) as modifier keys for cross-platform compatibility.
 *
 * @since 1.0.0
 */
export function isGridToggleShortcut(event: KeyboardEvent): boolean {
  return (
    (event.metaKey || event.ctrlKey) && event.shiftKey && event.code === "KeyG"
  );
}
