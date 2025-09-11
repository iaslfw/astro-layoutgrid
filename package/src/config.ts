export const createConfig = (dataset: DOMStringMap) => {
  return {
    columns: {
      mobile: parseInt(dataset.mobileColumns || "4"),
      tablet: parseInt(dataset.tabletColumns || "8"),
      desktop: parseInt(dataset.desktopColumns || "12"),
    },
    breakpoints: {
      tablet: parseInt(dataset.tabletBreakpoint || "768"),
      desktop: parseInt(dataset.desktopBreakpoint || "1024"),
    },
    gutter: JSON.parse(dataset.gutter || "[0.75, 1, 1]") as [
      number,
      number,
      number,
    ],
    margin: JSON.parse(dataset.margin || "[0.75, 1, 1]") as [
      number,
      number,
      number,
    ],
    gridColor: dataset.gridColor || "#ff0000",
    gridOpacity: parseFloat(dataset.gridOpacity || "0.1"),
    showBackground: dataset.showBackground === "true",
  };
};
