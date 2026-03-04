---
page: iconizer-ui-refactor
---

# Iconizer UI Refactoring - Modern Redesign

Refactor the Iconizer desktop application UI to be more modern, distinctive, and production-ready using React, TypeScript, and Tailwind CSS. Transform the current 3-column layout into a more intuitive, high-end UX experience.

**Current State Analysis:**

- 3-column grid layout: Import (left), Configure (middle), Output (right)
- Glassmorphism dark theme with gradient accents
- Tauri + React + TypeScript stack
- Existing components: DropZone, SizeSelector, FormatSelector, PresetConfigurations, OutputPanel, Settings

**DESIGN SYSTEM (REQUIRED):**

- Platform: Desktop-first web app (Tauri wrapper)
- Theme: Dark, sophisticated, with subtle depth
- Background: Deep slate (#0F172A) with layered transparency
- Surface: Semi-transparent cards with blur effects
- Primary Accent: Emerald Green (#22C55E) for CTAs and success states
- Secondary Accents: Blue (#3B82F6), Purple (#8B5CF6), Cyan (#06B6D4)
- Text Primary: Near White (#F8FAFC)
- Text Secondary: Muted slate (#94A3B8)
- Typography: Inter font family, clear hierarchy
- Border Radius: 8px-16px for modern feel
- Effects: Glassmorphism, subtle glows, smooth transitions (200-300ms)

**Page Structure:**

1. **Header:** Logo, navigation actions (settings, shortcuts, about), theme toggle
2. **Hero Section:** Value proposition with animated background elements
3. **Feature Badges:** Quick feature highlights (Fast Processing, Batch Conversion, 10+ Formats)
4. **Main Workspace:**
   - Left Panel: Image Import with drag-drop zone and file list
   - Center Panel: Configuration (sizes, formats, presets)
   - Right Panel: Output settings and conversion controls
5. **Footer:** Attribution, tech stack indicators

**UI/UX Enhancements Required:**

- Refined glassmorphism with better blur and transparency
- Animated background with subtle gradient orbs
- Micro-interactions on hover/focus states
- Progress indicators during conversion
- Empty states with helpful guidance
- Responsive error states
- Keyboard shortcuts integration
- Settings modal with organized sections

**Component Improvements:**

- DropZone: Enhanced drag feedback, file preview thumbnails, clear actions
- SizeSelector: Visual size grid with icons for common sizes
- FormatSelector: Format cards with format-specific icons
- PresetConfigurations: Preset cards with quick-select
- OutputPanel: Clear summary, progress visualization, result feedback

**Modern Design Elements:**

- Smooth 300ms transitions on all interactive elements
- Subtle glow effects on focus/hover
- Animated gradient backgrounds
- Icon-integrated buttons and labels
- Loading states with skeleton or spinner
- Toast notifications for feedback
- Keyboard-accessible interactions

**Technical Requirements:**

- Maintain existing Tauri backend integration
- Keep all existing functionality
- Ensure accessibility (WCAG 2.1 AA)
- Responsive down to 1024px (desktop app)
- Use Lucide React for all icons (no emojis)
- TypeScript strict mode compliance
