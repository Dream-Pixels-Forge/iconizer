# Iconizer Architecture

## Overview

Iconizer follows a hybrid architecture combining:
- **Tauri v2** for the desktop application shell
- **React + TypeScript** for the frontend UI
- **Rust** for system-level operations
- **Sharp (Node.js)** for high-performance image processing

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ICONIZER APPLICATION                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  FRONTEND (React)                    │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │   Import    │  │  Configure  │  │   Output    │  │    │
│  │  │   Module    │  │   Module    │  │   Module    │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │   Preview   │  │  Progress   │  │   Settings  │  │    │
│  │  │   Module    │  │   Module    │  │   Module    │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│                           │ Tauri IPC (invoke/send)          │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  BACKEND (Rust)                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │    File     │  │   Image     │  │    Batch    │  │    │
│  │  │   Handler   │  │  Processor  │  │   Manager   │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│                           │ Node.js API (Sidecar)            │
│                           ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              IMAGE ENGINE (Sharp)                    │    │
│  │         libvips-based processing core                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components

#### Import Module
- `DropZone.tsx` - Drag-and-drop file import
- `FileBrowser.tsx` - Native file dialog integration
- `ImagePreview.tsx` - Image preview with zoom

#### Configure Module
- `SizeSelector.tsx` - Size selection UI
- `FormatSelector.tsx` - Format selection UI
- `PresetSelector.tsx` - Quick preset configurations

#### Output Module
- `OutputPanel.tsx` - Output configuration
- `DirectorySelector.tsx` - Folder selection
- `NamingConvention.tsx` - File naming patterns

#### Settings Module
- `SettingsPanel.tsx` - Application settings
- `ThemeToggle.tsx` - Dark/Light theme switch

### Backend Modules

#### Image Processing (Rust)
- `converter.rs` - Format conversion logic
- `resizer.rs` - Image resizing
- `batch.rs` - Batch processing coordination

#### File Operations (Rust)
- `validator.rs` - File validation
- `organizer.rs` - Output organization

#### Configuration (Rust)
- `persistence.rs` - Settings persistence

## Data Flow

### Image Conversion Flow

```
1. User drops image → DropZone
2. File validated → FileValidator
3. Metadata extracted → ImageMetadata
4. State updated → ImportStore
5. User configures sizes/formats → ConfigStore
6. User clicks Convert → OutputPanel
7. Tauri invoke → Rust backend
8. Rust calls Sharp processor
9. Progress events → Frontend
10. Files saved → Output directory
11. Completion notification
```

## State Management

### Zustand Stores

1. **importStore** - Manages imported images
2. **configStore** - Manages conversion configuration
3. **settingsStore** - Manages application settings
4. **batchStore** - Manages batch processing state

## Security Considerations

- File system access scoped to user-selected directories
- No network connectivity required
- Input validation on all file operations
- Secure IPC communication

## Performance Optimizations

- Parallel image processing with Rayon
- Lazy loading of image previews
- Efficient state updates with Zustand
- Code splitting with Vite

## Testing Strategy

- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for Tauri commands
- E2E tests with Playwright
