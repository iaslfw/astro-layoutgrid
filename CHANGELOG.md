# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-09-19

### Added

- **Typescript Intellisense**: See the props by your IDE when using this component

### Enhanced

- **Gutter and margin**: From now on, you can set your margin and gutter in two different ways
  - Let it as it was now. Meaning you can still use an array for finer controls based on viewport sizes
  - Set one number for all viewports

## [1.1.0] - 2025-09-13

### Added

- **zIndex Configuration**: Added configurable z-index property for better layer control
  - New `zIndex` prop in component interface for controlling overlay stacking
  - Allows developers to position grid above or below other elements as needed
  - Improves integration with complex layouts and modal overlays

### Enhanced

- **TypeScript Support**: Extended type definitions to include zIndex property
- **Component Flexibility**: Better control over grid positioning in layered interfaces

## [1.0.1] - 2025-09-13

### Changed

- **Project Structure**: Moved demo folder to separate project for cleaner package organization
- **Package Organization**: Restructured project with standard npm package layout
  - Moved all package files from `/package/` subdirectory to root level
  - Updated [`package.json`](package.json ) entry points to reflect new structure
  - Cleaned up unnecessary build files and directories
- **Simplified Dependencies**: Removed workspace configuration for independent package management

### Fixed

- **README Demo Section**: Improved demo image alt text for better accessibility
- **Package Entry Points**: Corrected file paths in [`package.json`](package.json ) after restructuring

### Removed

- **Demo Folder**: Moved to separate repository for better separation of concerns
- **Build Dependencies**: Removed unused TypeScript compilation and build artifacts

## [1.0.0] - 2025-09-12

### Added

- **Initial Release**: First stable version of Astro LayoutGrid component
- **Core Grid System**: Zero-dependency layout grid for AstroJS applications
- **Responsive Configuration**: Customizable grid with configurable rows, columns, and gaps
- **Breakpoint Support**: Mobile, tablet, and desktop responsive breakpoints
- **Interactive Controls**: Toggle grid visibility with keyboard shortcuts
- **TypeScript Support**: Full TypeScript integration with type definitions
- **Astro Integration**: Native `.astro` component format for seamless integration
- **Visual Customization**: Configurable colors, opacity, and z-index settings
- **Accessibility**: ARIA support and keyboard navigation
- **Documentation**: Comprehensive README with usage examples and API documentation

### Features

- **Grid Configuration**: Adjustable rows and columns per breakpoint
- **Responsive Design**: Mobile-first approach with customizable breakpoints
- **Keyboard Shortcuts**: Configurable hotkeys for grid toggle functionality
- **Visual Styling**: Customizable grid colors, gaps, and transparency
- **Developer Tools**: Perfect for layout debugging and design alignment
- **Zero Dependencies**: Lightweight package with no external dependencies
- **Modern Standards**: ESM modules, TypeScript ready, Astro 5.0+ compatible

### Technical Details

- **Package Type**: Source distribution (no build step required)
- **Module Format**: ESM (ECMAScript modules)
- **Peer Dependencies**: Astro ^5.0.0
- **Browser Support**: Modern browsers with ES2022+ support
- **License**: MIT License for open source usage
- **Package Size**: Minimal footprint with zero dependencies

---

**Release Notes:**

**v1.1.0** added the functionality to change the zIndex of the component for better controls.

**v1.0.1** focuses on improving the package structure and maintainability by adopting standard npm package conventions and separating development concerns.

**v1.0.0** was the initial stable release, providing developers with a powerful, lightweight solution for layout debugging and design alignment in AstroJS applications.

For installation instructions, usage examples, and full documentation, please see the [README.md](README.md).
