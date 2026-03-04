# Iconizer - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Prerequisites

```bash
# Check Node.js (18+ required)
node --version

# Check pnpm (8+ required)
pnpm --version

# Check Rust (1.75+ required)
rustc --version
```

If any are missing, install them:
- Node.js: https://nodejs.org/
- pnpm: `npm install -g pnpm`
- Rust: https://rustup.rs/

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start Development

```bash
pnpm tauri dev
```

The app will launch automatically. Hot reload is enabled!

---

## 📁 Project Overview

### What You Get

- **Desktop App** - Cross-platform (Windows, macOS, Linux)
- **Modern UI** - React + Tailwind CSS + shadcn/ui
- **Fast Processing** - Sharp (libvips) image engine
- **Type Safe** - Full TypeScript coverage
- **Test Ready** - Vitest + Playwright setup

### Key Features (MVP)

✅ Drag-and-drop image import  
✅ Multi-format conversion (PNG, JPG, WebP, ICO, BMP)  
✅ Batch size generation (16x16 to 1024x1024)  
✅ Selective output control  
✅ Quick presets (Web, Mobile, Desktop)  
✅ Dark/Light themes  
✅ Progress tracking  

---

## 📋 Essential Commands

### Development

```bash
# Start dev mode
pnpm tauri dev

# Frontend only (faster for UI work)
pnpm dev
```

### Building

```bash
# Production build
pnpm tauri build

# Build outputs in:
# - Windows: src-tauri/target/release/bundle/msi/, nsis/
# - macOS: src-tauri/target/release/bundle/dmg/, app/
# - Linux: src-tauri/target/release/bundle/appimage/, deb/
```

### Testing

```bash
# Run tests
pnpm test

# Tests with UI
pnpm test:ui

# Coverage report
pnpm test:coverage
```

### Code Quality

```bash
# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:check
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [PRD.md](./PRD.md) | Product requirements |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Architecture & milestones |
| [TASKS.md](./TASKS.md) | Task breakdown |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Technical architecture |
| [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Development guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [PRIDES_SUMMARY.md](./PRIDES_SUMMARY.md) | Complete workflow summary |

---

## 🎯 First Tasks

### For New Developers

1. **Read the docs**
   - Start with README.md
   - Review docs/DEVELOPMENT.md
   - Check PRD.md for features

2. **Explore the code**
   - `src/App.tsx` - Main application
   - `src/components/` - UI components
   - `src-tauri/src/main.rs` - Rust backend

3. **Make a small change**
   - Try updating the app title
   - Add a console.log
   - Run tests to verify

### For First Contribution

1. Pick a P1 or P2 task from TASKS.md
2. Create a branch: `git checkout -b feature/your-task`
3. Make changes
4. Run tests: `pnpm test`
5. Lint: `pnpm lint`
6. Commit: `git commit -m "feat: your change"`
7. Push and create PR

---

## 🐛 Troubleshooting

### "pnpm: command not found"

```bash
npm install -g pnpm
```

### "Rust not found"

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### "Port 1420 already in use"

```bash
# Kill process on port
# Windows:
netstat -ano | findstr :1420
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:1420 | xargs kill -9
```

### "Module not found"

```bash
# Clean reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Rust compilation errors

```bash
# Update Rust
rustup update

# Clear cache
cd src-tauri
cargo clean
cd ..
```

---

## 📞 Getting Help

1. **Check documentation** - Most answers are in the docs
2. **Search issues** - Someone may have had the same problem
3. **Ask in Discord** - Community support available

---

## 🎉 You're Ready!

The project is fully set up and ready for development. Start with:

```bash
pnpm tauri dev
```

Happy coding! 🚀

---

**Last Updated:** 2026-03-03  
**Version:** 1.0.0-mvp
