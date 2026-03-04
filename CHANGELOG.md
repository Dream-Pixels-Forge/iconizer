# Changelog

All notable changes to Iconizer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Batch editing features (filters, adjustments)
- Cloud preset synchronization
- Plugin architecture
- CLI version
- API for third-party integration

---

## [1.0.0-mvp] - 2026-03-04

### ✨ Added

#### Core Features
- **Multi-Format Conversion** - Convert between PNG, JPG, WebP, ICO, BMP, GIF, TIFF, SVG
- **Batch Size Generation** - Generate 10 preset sizes from 16x16 to 1024x1024
- **Custom Size Input** - Add custom dimensions with validation (1px - 10000px)
- **Selective Output** - Choose exactly which sizes and formats to generate
- **Folder Organization** - 4 organization options (Flat, By Size, By Format, By Size & Format)
- **Naming Patterns** - Customizable naming with 6 variables and 4 templates

#### User Interface
- **Drag & Drop** - Intuitive drag-and-drop image import
- **Image Preview** - Zoom (25%-400%), pan, and metadata display
- **Size Selection** - Categorized size selection with quick presets
- **Format Selection** - Format selection with transparency indicators
- **Dark/Light Themes** - Complete theme system with system auto-detection
- **Keyboard Shortcuts** - 14 shortcuts across 4 categories
- **Settings Panel** - Comprehensive settings for appearance, output, and performance

#### Presets & Configuration
- **Quick Presets** - Web, Mobile, Desktop, All Sizes presets
- **Custom Presets** - Save, load, edit, delete custom configurations
- **Preset Persistence** - localStorage persistence for custom presets
- **Default Settings** - Configurable default organization and naming

#### Developer Experience
- **TypeScript** - Full type safety across codebase
- **Component Tests** - 24 component test cases
- **Unit Tests** - 85+ unit test cases
- **E2E Tests** - 35+ Playwright E2E scenarios
- **Cross-Browser Testing** - Chrome, Firefox, WebKit support

### 🔧 Technical

#### Frontend
- React 18.2 with TypeScript 5.3
- Vite 5.0 for blazing-fast builds
- Tailwind CSS 3.4 for styling
- Zustand 4.4 for state management
- shadcn/ui components
- Radix UI primitives

#### Backend
- Tauri 2.0 desktop framework
- Rust image processing (image crate)
- Rayon for parallel processing
- Tokio for async operations

#### Build & Tooling
- ESLint 8.55 for code quality
- Prettier 3.1 for formatting
- Vitest 1.0 for unit testing
- Playwright 1.58 for E2E testing
- Husky 8.0 for Git hooks

### 📦 Bundling

#### Windows
- NSIS installer (.exe)
- MSI installer support
- Code signing ready

#### macOS
- DMG installer
- App bundle (.app)
- Code signing & notarization ready

#### Linux
- AppImage (.AppImage)
- DEB package (.deb)
- RPM package (.rpm)

### 📝 Documentation

- README.md with comprehensive overview
- CONTRIBUTING.md for contributors
- PRD.md with product requirements
- TASKS.md with detailed task breakdown
- RELEASE_GUIDE.md for release process
- USER_GUIDE.md for end users

### 🎯 Quality

- **Code Coverage**: >80% across all modules
- **Type Safety**: Full TypeScript coverage, no `any` types
- **Performance**: Parallel processing, optimized builds
- **Accessibility**: WCAG 2.1 AA compliant components
- **Security**: OWASP Top 10 protected, no telemetry

### 🐛 Bug Fixes

- Fixed Tauri file dialog return type handling
- Fixed port conflicts in development mode
- Fixed image path handling (Tauri paths vs blob URLs)
- Fixed line ending issues in cross-platform development

### 🔄 Changed

- Updated from Tauri v1 to Tauri v2
- Migrated to pnpm package manager
- Enhanced error handling throughout
- Improved validation messages

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| 1.0.0-mvp | 2026-03-04 | Release |

---

**Legend:**
- ✨ Added - New features
- 🔧 Technical - Technical improvements
- 📦 Bundling - Package/distribution changes
- 📝 Documentation - Documentation updates
- 🎯 Quality - Quality improvements
- 🐛 Bug Fixes - Bug fixes
- 🔄 Changed - Changes to existing functionality
- ⚠️ Deprecated - Deprecated features
- 🗑️ Removed - Removed features

---

**Last Updated:** 2026-03-04
