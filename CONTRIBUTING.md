# Contributing to Astro LayoutGrid

Thank you for your interest in contributing to Astro LayoutGrid! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git
- Basic knowledge of TypeScript and Astro

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
3. ```bash
   git clone https://github.com/YOUR_USERNAME/astro-layoutgrid.git
   cd astro-layoutgrid
   ```

4. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/iaslfw/astro-layoutgrid.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run type checking:**
   ```bash
   npm run typecheck
   ```

3. **Run linting:**
   ```bash
   npm run lint
   ```

4. **Format code:**
   ```bash
   npm run format
   ```

5. **Test package locally:**
   ```bash
   npm run testLocal
   ```

## Contributing Guidelines

### Types of Contributions

All major several types of contributions are welcomed:

- **Bug fixes**
- **New features**
- **Documentation improvements**
- **Code style improvements**
- **Performance optimizations**
- **Tests**
- **Accessibility improvements**
- **Feature request**

### Me and the package are looking for

- **Bug Reports**: Clear, reproducible issues with examples
- **Feature Requests**: Well-thought-out proposals that align with the project goals
- **Code Contributions**: Clean, well-tested code that follows our conventions
- **Documentation**: Improvements to README, code comments, or examples
- **Feature Requests**: Ideas or hints for improvements and new ideas

### What We're NOT Looking For

- Breaking changes without discussion
- Features that significantly increase bundle size
- Code that doesn't follow TypeScript best practices
- Contributions without proper testing

## Pull Request Process

### Before You Start

1. **Check existing issues** to avoid duplicating work
2. **Open an issue** for significant changes to discuss the approach
3. **Keep changes focused** - one feature/fix per PR

### PR Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Follow existing code style
   - Add/update tests if applicable
   - Update documentation if needed

3. **Test your changes:**
   ```bash
   npm run typecheck
   npm run lint
   npm run testLocal
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add zIndex configuration support"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### PR Requirements

- **Clear title and description**
- **Reference related issues** (e.g., "Closes #123")
- **Include examples** if adding new features
- **Pass all checks** (linting, type checking)
- **Update documentation** if applicable
- **Add changelog entry** for significant changes

### Commit Message Format

We follow conventional commits:

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
- feat: add zIndex configuration prop
- fix: resolve grid positioning bug on mobile
- docs: update installation instructions
- style: format code with prettier
```

## Issue Guidelines

### Bug Reports

When reporting bugs, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior**
- **Actual behavior**
- **Environment details** (Astro version, browser, OS)
- **Code example** (minimal reproduction)
- **Screenshots** if applicable

### Feature Requests

For feature requests, please include:

- **Clear description** of the feature
- **Use case** - why is this needed?
- **Proposed implementation** (if you have ideas)
- **Examples** of how it would be used
- **Impact assessment** (breaking changes?)

## Code Style

### General Guidelines

- Use **TypeScript** for all code
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable names**
- Write **self-documenting code**
- Add **JSDoc comments** for public APIs

### File Structure

```
src/
├── Layoutgrid.astro     # Main component
├── types.ts             # Type definitions
├── config.ts            # Configuration constants
├── utils.ts             # Utility functions
└── astro.d.ts          # Astro type augmentation
```

### Component Guidelines

- **Props should be typed** with interfaces
- **Use Astro props pattern** consistently
- **Keep components focused** on single responsibility
- **Document props** with JSDoc comments

### TypeScript Guidelines

- **Use strict mode**
- **Prefer interfaces** over types for objects
- **Use proper generic constraints**
- **Avoid `any` type**
- **Use branded types** for validation when appropriate

## Testing

Currently, the project uses:

- **TypeScript compilation** for type checking
- **ESLint** for code quality
- **npm pack** for package testing

### Future Testing Goals

We welcome contributions to add:

- Unit tests with Vitest
- Component testing
- Integration tests
- Visual regression tests

## Documentation

### Types of Documentation

- **README.md** - Main project documentation
- **CHANGELOG.md** - Version history
- **Code comments** - Inline documentation
- **Type definitions** - Self-documenting APIs

### Documentation Standards

- **Keep it updated** with code changes
- **Use clear examples**
- **Include code snippets**
- **Explain the "why" not just "what"**

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (1.x.0) - New features (backward compatible)
- **PATCH** (1.0.x) - Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test package with `npm pack`
- [ ] Create GitHub release
- [ ] Publish to npm

## Tips for Contributors

### First-Time Contributors

- Start with **good first issue** labels
- **Ask questions** if anything is unclear
- **Small PRs** are easier to review
- **Don't hesitate** to ask for help

### Regular Contributors

- **Review other PRs** when possible
- **Help with issue triage**
- **Suggest improvements** to processes
- **Mentor new contributors**

## Questions?

- **Open an issue** for technical questions
- **Check existing issues** first
- **Be specific** about your question
- **Provide context** about what you're trying to achieve

## Recognition

All contributors will be recognized in our README.md file. We appreciate:

- Code contributions
- Bug reports
- Documentation improvements
- Community support
- Feature suggestions

## License

By contributing to Astro LayoutGrid, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Astro LayoutGrid!** 

Your contributions help make this project better for the entire Astro community.