# Iconizer Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** 18+ - [Download](https://nodejs.org/)
- **pnpm** 8+ - [Install](https://pnpm.io/installation)
- **Rust** 1.75+ - [Install via rustup](https://rustup.rs/)
- **Git** - [Download](https://git-scm.com/)

### Platform-Specific

#### Windows
```powershell
# Install Visual Studio Build Tools
# Download from: https://visualstudio.microsoft.com/downloads/
# Select "Desktop development with C++" workload
```

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y build-essential curl wget libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev libvips-dev
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dream-pixels-forge/iconizer.git
cd iconizer
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Verify Rust setup
cd src-tauri
cargo check
cd ..
```

### 3. Start Development Mode

```bash
# This will start both the Vite dev server and Tauri app
pnpm tauri dev
```

The app should launch in a new window. Hot reload is enabled for both frontend and backend changes.

## Development Workflow

### Frontend Development

```bash
# Start Vite dev server only (for UI work)
pnpm dev

# Run frontend tests
pnpm test

# Lint frontend code
pnpm lint

# Format code
pnpm format
```

### Backend Development

```bash
# Build Rust backend only
cd src-tauri
cargo build

# Run Rust tests
cargo test

# Check for errors
cargo clippy
```

### Full Application

```bash
# Development with hot reload
pnpm tauri dev

# Production build
pnpm tauri build

# Build for specific platform
pnpm tauri build --target x86_64-pc-windows-msvc
```

## Project Structure

```
iconizer/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── ui/                  # Base UI components
│   │   ├── import/              # Import module
│   │   ├── configure/           # Configuration module
│   │   ├── output/              # Output module
│   │   ├── preview/             # Preview module
│   │   └── settings/            # Settings module
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities
│   ├── stores/                   # Zustand stores
│   ├── types/                    # TypeScript types
│   ├── test/                     # Test setup
│   ├── App.tsx                   # Main component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── commands/            # Tauri commands
│   │   ├── image/               # Image processing
│   │   ├── file/                # File operations
│   │   ├── config/              # Configuration
│   │   └── main.rs              # Entry point
│   ├── Cargo.toml               # Rust dependencies
│   ├── tauri.conf.json          # Tauri config
│   └── build.rs                 # Build script
├── docs/                         # Documentation
├── tests/                        # Test suites
└── scripts/                      # Utility scripts
```

## Making Changes

### Adding a New Component

1. Create the component file in the appropriate directory
2. Export from the module
3. Import and use in parent components

```tsx
// src/components/example/MyComponent.tsx
import React from 'react';

export default function MyComponent() {
  return <div>My Component</div>;
}
```

### Adding a New Tauri Command

1. Create the command in `src-tauri/src/commands/`
2. Export from `mod.rs`
3. Register in `main.rs`
4. Call from frontend with `invoke`

```rust
// src-tauri/src/commands/my_command.rs
use tauri::command;

#[command]
pub fn my_command(arg: String) -> Result<String, String> {
    Ok(format!("Hello, {}!", arg))
}
```

```typescript
// Frontend
import { invoke } from '@tauri-apps/api/core';
const result = await invoke('my_command', { arg: 'World' });
```

### Adding a New Store

```typescript
// src/stores/myStore.ts
import { create } from 'zustand';

interface MyState {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

## Debugging

### Frontend Debugging

1. Open DevTools in the Tauri window (Ctrl+Shift+I / Cmd+Option+I)
2. Use React DevTools for component inspection
3. Check Console for errors

### Backend Debugging

```bash
# Run with logging
RUST_LOG=debug pnpm tauri dev

# Use println! for simple logging
println!("Debug: {:?}", value);

# Use tracing for structured logging
tracing::debug!("Debug message");
```

### IPC Debugging

```typescript
// Log all IPC calls
import { invoke } from '@tauri-apps/api/core';

const debugInvoke = async (cmd: string, args?: Record<string, unknown>) => {
  console.log(`[IPC] Calling: ${cmd}`, args);
  const result = await invoke(cmd, args);
  console.log(`[IPC] Result:`, result);
  return result;
};
```

## Testing

### Running Tests

```bash
# All tests
pnpm test

# With UI
pnpm test:ui

# With coverage
pnpm test:coverage

# Specific test file
pnpm test -- MyComponent.test.tsx
```

### Writing Tests

```tsx
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('My Component')).toBeInTheDocument();
  });
});
```

## Building for Production

### Build All Platforms

```bash
pnpm tauri build
```

### Build Specific Platform

```bash
# Windows
pnpm tauri build --target x86_64-pc-windows-msvc

# macOS
pnpm tauri build --target x86_64-apple-darwin

# Linux
pnpm tauri build --target x86_64-unknown-linux-gnu
```

### Build Output

- **Windows:** `src-tauri/target/release/bundle/msi/`, `nsis/`
- **macOS:** `src-tauri/target/release/bundle/dmg/`, `app/`
- **Linux:** `src-tauri/target/release/bundle/appimage/`, `deb/`

## Code Quality

### Linting

```bash
# Frontend
pnpm lint

# Fix issues
pnpm lint:fix

# Backend
cd src-tauri
cargo clippy
```

### Formatting

```bash
# Frontend
pnpm format

# Check without writing
pnpm format:check

# Backend
cd src-tauri
cargo fmt
```

## Common Issues

### "Failed to compile Rust code"

```bash
# Update Rust
rustup update

# Clear build cache
cd src-tauri
cargo clean
```

### "Port already in use"

```bash
# Kill process on port 1420
# Windows
netstat -ano | findstr :1420
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:1420 | xargs kill -9
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Getting Help

- Check existing issues on GitHub
- Join our Discord server
- Read the architecture documentation
