# Astro LayoutGrid

A lightweight, zero-dependency responsive grid overlay component for Astro that helps developers align content with visual precision. Perfect for design system implementation, responsive development, and ensuring consistent layouts across breakpoints.

[![NPM Version](https://img.shields.io/npm/v/astro-layoutgrid)](https://www.npmjs.com/package/astro-layoutgrid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Built%20for-Astro-orange)](https://astro.build)

## Demo

[![Preview of the Astro LayoutGrid demo](https://github.com/iaslfw/astro-layoutgrid/blob/main/demo/src/assets/thumbnail.png)](https://astro-layoutgrid-demo.netlify.app)

## ✨ Features

- 🎯 **Responsive Grid Overlay** - Visual grid system with mobile, tablet, and desktop breakpoints
- ⌨️ **Keyboard Toggle** - Quick show/hide with `Cmd/Ctrl + Shift + G`
- 🔧 **Highly Customizable** - Configure columns, spacing, colors, and breakpoints
- 📱 **Real-time Responsive** - Uses ResizeObserver for instant breakpoint updates
- 🎨 **Visual Flexibility** - Border-only or filled column display options
- 🚀 **Zero Dependencies** - Lightweight and fast
- 🔒 **TypeScript Support** - Full type safety with comprehensive interfaces
- 🌐 **SSR Compatible** - Works with Astro's server-side rendering

## 📦 Installation

```bash
npm install astro-layoutgrid
```

## 🚀 Quick Start

### Basic Usage

```astro
---
import LayoutGrid from 'astro-layoutgrid';
---

<html>
	<head>
		<title>My Astro Site</title>
	</head>
	<body>
		<!-- Your content here -->
		<main>
			<h1>Welcome to my site</h1>
			<p>Content that will be aligned with the grid</p>
		</main>

		<!-- Add the grid overlay -->
		<LayoutGrid />
	</body>
</html>
```

Press `Cmd + Shift + G` (Mac) or `Ctrl + Shift + G` (Windows/Linux) to toggle the grid visibility.

### Custom Configuration

```astro
---
import LayoutGrid from 'astro-layoutgrid';
---

<LayoutGrid
	desktopColumns={16}
	tabletColumns={12}
	mobileColumns={6}
	gutter={[1, 1.5, 2]}
	margin={[1, 1.5, 2]}
	gridColor="#0066cc"
	gridOpacity={0.15}
	showBackground={true}
	maxWidth="1400px"
	tabletBreakpoint={768}
	desktopBreakpoint={1200}
/>
```

## 📚 API Reference

### Props

| Prop                | Type                                 | Default        | Description                                        |
| ------------------- | ------------------------------------ | -------------- | -------------------------------------------------- |
| `desktopColumns`    | `number`                             | `12`           | Number of columns on desktop (≥1024px)             |
| `tabletColumns`     | `number`                             | `8`            | Number of columns on tablet (768px-1023px)         |
| `mobileColumns`     | `number`                             | `4`            | Number of columns on mobile (<768px)               |
| `gutter`            | `number \| [number, number, number]` | `[0.75, 1, 1]` | Column spacing in rem [mobile, tablet, desktop]    |
| `margin`            | `number \| [number, number, number]` | `[0.75, 1, 1]` | Container margins in rem [mobile, tablet, desktop] |
| `gridColor`         | `string`                             | `"#ff0000"`    | CSS color for grid lines and backgrounds           |
| `gridOpacity`       | `number`                             | `0.1`          | Opacity for column backgrounds (0-1)               |
| `maxWidth`          | `string`                             | `"100vw"`      | Maximum width constraint (CSS value)               |
| `showBackground`    | `boolean`                            | `false`        | Show colored column backgrounds                    |
| `tabletBreakpoint`  | `number`                             | `768`          | Tablet breakpoint in pixels                        |
| `desktopBreakpoint` | `number`                             | `1024`         | Desktop breakpoint in pixels                       |
| `zIndex` | `number`                             | `1000`         | zIndex of the                       |

### Responsive Configuration

You can configure spacing in two ways:

#### Single Value (Applied to All Breakpoints)

```astro
<LayoutGrid gutter={1.5} margin={2} />
```

#### Array Values (Per Breakpoint)

```astro
<LayoutGrid gutter={[0.75, 1.25, 1.5]} <!-- [mobile, tablet, desktop] -->
	margin={[1, 1.5, 2]}
	<!-- [mobile, tablet, desktop] -->
	/></LayoutGrid
>
```

## 🎨 Visual Examples

### Standard Grid (Tailwind-like)

```astro
<LayoutGrid />
<!-- Uses defaults: 4/8/12 columns, standard breakpoints -->
```

### Design System Grid

```astro
<LayoutGrid
	desktopColumns={16}
	tabletColumns={12}
	mobileColumns={6}
	gutter={[1, 1.5, 2]}
	gridColor="#6366f1"
	showBackground={true}
	gridOpacity={0.1}
/>
```

### Custom Breakpoints

```astro
<LayoutGrid tabletBreakpoint={600} desktopBreakpoint={1200} maxWidth="1400px" />
```

## ⌨️ Keyboard Shortcuts

| Shortcut                           | Action                 |
| ---------------------------------- | ---------------------- |
| `Cmd + Shift + G` (Mac)            | Toggle grid visibility |
| `Ctrl + Shift + G` (Windows/Linux) | Toggle grid visibility |

## 🎯 Use Cases

### Design System Implementation

Perfect for implementing and validating design system grids:

```astro
---
// components/BaseLayout.astro
import LayoutGrid from 'astro-layoutgrid';
---

<html>
	<body>
		<slot />

		<!-- Development grid overlay -->
		{
			import.meta.env.DEV && (
				<LayoutGrid
					desktopColumns={12}
					gutter={[16, 24, 32]}
					margin={[16, 24, 80]}
					gridColor="#e2e8f0"
					showBackground={true}
				/>
			)
		}
	</body>
</html>
```

### Responsive Development

Validate responsive layouts across breakpoints:

```astro
<LayoutGrid
	mobileColumns={4}
	tabletColumns={8}
	desktopColumns={12}
	tabletBreakpoint={768}
	desktopBreakpoint={1024}
/>
```

### Content Alignment

Ensure content aligns with grid columns:

```astro
---
import LayoutGrid from 'astro-layoutgrid';
---

<div class="container">
	<div class="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
		<!-- Your grid content -->
	</div>
</div>

<!-- Overlay to verify alignment -->
<LayoutGrid gutter={1} <!-- 1rem="gap-4" in Tailwind -->
	gridColor="#ef4444" gridOpacity={0.2}
	/></LayoutGrid
>
```

## 🔧 Advanced Configuration

### Environment-Based Configuration

```astro
---
import LayoutGrid from 'astro-layoutgrid';

const isDev = import.meta.env.DEV;
const gridConfig = isDev
	? {
			showBackground: true,
			gridOpacity: 0.15,
			gridColor: '#10b981',
		}
	: {};
---

{isDev && <LayoutGrid {...gridConfig} />}
```

### Multiple Grid Systems

```astro
---
// For testing different grid systems
import LayoutGrid from 'astro-layoutgrid';
---

<!-- Standard 12-column grid -->
<LayoutGrid gridColor="#ef4444" />

<!-- 16-column design system grid -->
<LayoutGrid
	desktopColumns={16}
	gridColor="#3b82f6"
	showBackground={true}
	gridOpacity={0.05}
/>
```

## 🌐 Browser Support

- ✅ **Modern Browsers** - Chrome 88+, Firefox 87+, Safari 14+, Edge 88+
- ✅ **ResizeObserver** - Required for responsive behavior
- ✅ **Custom Elements** - Required for component functionality
- ✅ **CSS Grid** - Required for layout

## 🔍 Troubleshooting

### Grid Not Visible

1. Check if keyboard shortcut is working: `Cmd/Ctrl + Shift + G`
2. Verify the component is imported and used correctly
3. Check browser console for any JavaScript errors
4. Ensure `z-index: 1000` isn't being overridden by other elements

### Columns Not Aligning

1. Verify your CSS grid/flexbox setup matches the LayoutGrid configuration
2. Check that `gutter` values match your CSS gap values
3. Ensure `margin` values match your container padding
4. Use browser dev tools to inspect grid overlay positioning

### TypeScript Errors

1. Ensure you're using TypeScript 4.5+ for proper Astro support
2. Check that all prop types match the interface definitions
3. Verify array formats for `gutter` and `margin` props

## 📝 Contributing

Contributions and ideas are welcome! Please visit the [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by CSS Grid systems and design tools like Figma
- Built for the amazing [Astro](https://astro.build) community
- Thanks to all contributors and users providing feedback

---

**Made with ❤️, ☕️ and 🥲 for the Astro community**
