# Iconizer

[![Release](https://img.shields.io/github/v/release/dream-pixels-forge/iconizer)](https://github.com/dream-pixels-forge/iconizer/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/dream-pixels-forge/iconizer/ci.yml?branch=main)](https://github.com/dream-pixels-forge/iconizer/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-24C8CD)](https://tauri.app/)

**Version:** 1.0.0-mvp | **Status:** Stable Release

**Iconizer** is a powerful desktop application for batch image conversion and icon generation. Convert images between formats and generate multiple sizes in a single operation.

![Iconizer Preview](./docs/assets/preview.png)

## Features

- 🔄 **Multi-Format Conversion** - Convert between ICO, PNG, JPG, WebP, BMP, and more
- 📐 **Batch Size Generation** - Generate multiple sizes (16x16 to 1024x1024) in one operation
- ✅ **Selective Output** - Choose exactly which sizes and formats to generate
- 🎨 **Drag & Drop** - Intuitive interface with drag-and-drop import
- ⚡ **Fast Processing** - Parallel processing powered by Sharp/libvips
- 🌙 **Dark/Light Themes** - Beautiful UI that adapts to your preference
- 💾 **Offline First** - No internet required, all processing is local

## Supported Formats

### Input
- PNG, JPG/JPEG, WebP, BMP, GIF, TIFF, SVG (limited)

### Output
- ICO, PNG, JPG, WebP, BMP, SVG (traced)

## Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **pnpm** 8+ ([install](https://pnpm.io/installation))
- **Rust** 1.75+ ([install](https://rustup.rs/))

### Platform-Specific Requirements

**Windows:**
- Visual Studio Build Tools 2022+ with C++ workload

**macOS:**
- Xcode Command Line Tools (`xcode-select --install`)

**Linux:**
- Build essentials: `sudo apt install build-essential`
- libvips: `sudo apt install libvips-dev`

### Installation

```bash
# Clone the repository
git clone https://github.com/dream-pixels-forge/iconizer.git
cd iconizer

# Install dependencies
pnpm install

# Start development mode
pnpm tauri dev

# Build for production
pnpm tauri build
```

## Usage

1. **Import Images** - Drag and drop images or use the file browser
2. **Configure Output** - Select desired sizes and formats
3. **Choose Destination** - Pick output folder and naming convention
4. **Convert** - Click convert and wait for processing to complete

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [User Guide](./docs/USER_GUIDE.md)
- [API Reference](./docs/API.md)

## Project Structure

```
iconizer/
├── src/                    # Frontend React code
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── stores/             # State management
│   └── types/              # TypeScript types
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   └── main.rs         # Entry point
│   └── Cargo.toml          # Rust dependencies
├── sharp-processor/        # Image processing (Node.js)
├── docs/                   # Documentation
└── tests/                  # Test suites
```

## Technology Stack

- **Desktop Framework:** [Tauri v2](https://tauri.app/)
- **Frontend:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

## Development

### Commands

```bash
# Development
pnpm tauri dev          # Start dev mode with hot reload

# Build
pnpm build              # Build frontend
pnpm tauri build        # Build production app

# Testing
pnpm test               # Run tests
pnpm test:ui            # Run tests with UI
pnpm test:coverage      # Run tests with coverage

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Format with Prettier
pnpm format:check       # Check formatting
```

### Branch Strategy

- `main` - Production-ready code (protected)
- `dev` - Integration branch
- `feature/*` - Feature branches
- `release/*` - Release preparation
- `hotfix/*` - Critical fixes

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### ✅ v1.0.0-mvp (Released 2026-03-04)
- [x] Project setup and architecture
- [x] Core image conversion
- [x] Batch size generation (10 presets + custom)
- [x] Selective output control
- [x] Complete UI/UX with themes
- [x] Keyboard shortcuts
- [x] Preset management
- [x] Comprehensive testing (120+ tests)
- [x] Documentation complete

### 🔄 v1.1.0 (Planned)
- [ ] Batch editing (filters, adjustments)
- [ ] Cloud preset sync
- [ ] CLI version
- [ ] Performance optimizations

### 📋 Future
- [ ] Plugin architecture
- [ ] API for third-party integration
- [ ] Mobile version
- [ ] Web version

## Downloads

Get the latest release from the [Releases Page](https://github.com/dream-pixels-forge/iconizer/releases)

### Available Packages

| Platform | Package | Download |
|----------|---------|----------|
| **Windows** | NSIS Installer (.exe) | [Download](../../releases/latest) |
| **Windows** | MSI Installer (.msi) | [Download](../../releases/latest) |
| **macOS** | DMG (.dmg) | [Download](../../releases/latest) |
| **macOS** | App Bundle (.app) | [Download](../../releases/latest) |
| **Linux** | AppImage (.AppImage) | [Download](../../releases/latest) |
| **Linux** | DEB Package (.deb) | [Download](../../releases/latest) |
| **Linux** | RPM Package (.rpm) | [Download](../../releases/latest) |

### Installation

**Windows:**
```powershell
# Using winget (coming soon)
winget install dream-pixels-forge.iconizer

# Or download and run the .exe installer
```

**macOS:**
```bash
# Using Homebrew (coming soon)
brew install --cask iconizer

# Or download the .dmg and drag to Applications
```

**Linux:**
```bash
# Using AUR (coming soon)
yay -S iconizer

# Or download AppImage
chmod +x Iconizer_*.AppImage
./Iconizer_*.AppImage
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) for the amazing desktop framework
- [Sharp](https://sharp.pixelplumbing.com/) for blazing-fast image processing
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- All contributors and supporters

---

**Built with ❤️ by Dream Pixels Forge**
