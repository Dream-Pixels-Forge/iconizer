# Iconizer - Task Breakdown & Backlog

## 📊 Project Status Summary

**Last Updated:** 2026-03-04  
**Current Sprint:** Milestone 7 Completion  
**Overall Progress:** ~80% Complete

### Completed Milestones

| Milestone | Status | Completion Date | Commits |
|-----------|--------|-----------------|---------|
| **M1: Foundation** | ✅ Complete | 2026-03-01 | Multiple |
| **M2: Import Module** | ✅ Complete | 2026-03-02 | e91ab12 |
| **M3: Configuration Module** | ✅ **Complete** | **2026-03-04** | **d623bbf** |
| **M4: Image Processing Engine** | ✅ Complete | 2026-03-03 | e91ab12 |
| **M5: Batch Processing** | ✅ Complete | 2026-03-03 | e91ab12 |
| **M6: Output Management** | ✅ **Complete** | **2026-03-04** | **d623bbf** |
| **M7: Polish & Settings** | ✅ **Complete** | **2026-03-04** | **3d8ba5c** |

### In Progress / Upcoming

| Milestone | Status | Priority | Next Actions |
|-----------|--------|----------|--------------|
| **M8: Testing & QA** | 🟡 Partial | P0 | E2E tests, performance testing |
| **M9: Release Preparation** | 🔄 Pending | P0 | Code signing, installers |

---

## Recent Changes (2026-03-04)

**Latest Commit:** `3d8ba5c` - feat: add keyboard shortcuts system

### M7-T3: Keyboard Shortcuts ✅
- 14 keyboard shortcuts across 4 categories
- useKeyboardShortcuts hook for management
- ShortcutsHelp dialog with visual key display
- Platform-specific modifiers (Ctrl/Cmd)
- Global shortcuts (? for help even when typing)
- Navigation shortcuts (1-4)
- Action shortcuts (Ctrl+Enter, Ctrl+O, Ctrl+A)
- View shortcuts (theme toggle, zoom controls)

**Previous:** `b2103c7` - feat: add enhanced theme system with dropdown toggle

---

## Task Organization

Tasks are organized by milestone and prioritized using the MoSCoW method:
- **P0 (Must Have):** Critical for MVP
- **P1 (Should Have):** Important but not critical
- **P2 (Could Have):** Desirable features
- **P3 (Won't Have - MVP):** Postponed to future releases

---

## Milestone 1: Foundation (Week 1-2)

### M1-T1: Project Initialization
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** None

**Tasks:**
- [ ] Initialize Tauri v2 project with `pnpm create tauri-app`
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Setup Vite configuration
- [ ] Configure Tailwind CSS
- [ ] Install shadcn/ui base components
- [ ] Setup ESLint + Prettier
- [ ] Configure Husky pre-commit hooks

**Acceptance Criteria:**
- `pnpm tauri dev` launches successfully
- TypeScript compilation without errors
- Linting passes on all files

---

### M1-T2: Git Repository Setup
**Priority:** P0 | **Estimate:** 2h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Initialize Git repository
- [ ] Create .gitignore (Node, Rust, OS files)
- [ ] Create branch structure (main, dev)
- [ ] Setup branch protection rules
- [ ] Create initial commit
- [ ] Push to remote repository

**Acceptance Criteria:**
- Repository accessible remotely
- Branch protection enabled on main
- Clean initial commit history

---

### M1-T3: CI/CD Pipeline Setup
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T2

**Tasks:**
- [ ] Create GitHub Actions workflow
- [ ] Configure lint/type-check job
- [ ] Configure test job
- [ ] Configure build job (Windows)
- [ ] Configure build job (macOS)
- [ ] Configure build job (Linux)
- [ ] Setup artifact upload
- [ ] Add CI badge to README

**Acceptance Criteria:**
- CI runs on every push
- All jobs complete successfully
- Build artifacts available for download

---

### M1-T4: Project Documentation Setup
**Priority:** P1 | **Estimate:** 3h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Create README.md with project overview
- [ ] Create CONTRIBUTING.md
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Setup docs/ folder structure
- [ ] Create architecture diagrams
- [ ] Document development setup

**Acceptance Criteria:**
- README provides clear project overview
- New developers can setup from docs
- Architecture is documented

---

### M1-T5: Development Environment Configuration
**Priority:** P1 | **Estimate:** 2h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Create .env.example file
- [ ] Setup VS Code workspace settings
- [ ] Create launch.json for debugging
- [ ] Configure Rust analyzer settings
- [ ] Create setup script for prerequisites

**Acceptance Criteria:**
- VS Code workspace configured
- Debugging works for frontend and backend
- Setup script runs without errors

---

## Milestone 2: Import Module (Week 2-3)

### M2-T1: Drag-and-Drop Component
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Create DropZone component
- [ ] Implement drag enter/leave handlers
- [ ] Implement drop handler
- [ ] Add visual feedback (highlight, cursor)
- [ ] Add file type validation
- [ ] Add file size validation
- [ ] Style component with Tailwind
- [ ] Write unit tests

**Acceptance Criteria:**
- Files can be dragged and dropped
- Visual feedback on drag operations
- Invalid files rejected with message
- Tests cover all scenarios

**Files:**
- `/src/components/import/DropZone.tsx`
- `/src/components/import/DropZone.test.tsx`

---

### M2-T2: File Browser Integration
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M2-T1

**Tasks:**
- [ ] Create FileBrowser component
- [ ] Integrate Tauri file dialog API
- [ ] Configure file type filters
- [ ] Implement multi-select
- [ ] Add "Browse Files" button
- [ ] Handle cancellation
- [ ] Write integration tests

**Acceptance Criteria:**
- File dialog opens on button click
- Only supported formats selectable
- Multiple files can be selected
- Cancellation handled gracefully

**Files:**
- `/src/components/import/FileBrowser.tsx`
- `/src-tauri/src/commands/file_dialog.rs`

---

### M2-T3: Image Preview Component
**Priority:** P0 | **Estimate:** 8h | **Dependencies:** M2-T1

**Tasks:**
- [ ] Create ImagePreview component
- [ ] Implement image loading
- [ ] Add zoom controls (+/- buttons)
- [ ] Add zoom slider
- [ ] Implement pan functionality
- [ ] Display image metadata (dimensions, size)
- [ ] Add loading state
- [ ] Add error state
- [ ] Style component
- [ ] Write unit tests

**Acceptance Criteria:**
- Image displays correctly
- Zoom works smoothly (25% - 400%)
- Metadata displays accurately
- Loading/error states visible

**Files:**
- `/src/components/preview/ImagePreview.tsx`
- `/src/components/preview/ZoomControls.tsx`
- `/src/components/preview/MetadataDisplay.tsx`

---

### M2-T4: File Validation Service
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M2-T1

**Tasks:**
- [ ] Create file validation utility
- [ ] Implement format validation (magic numbers)
- [ ] Implement size validation
- [ ] Implement dimension validation
- [ ] Create error message catalog
- [ ] Add logging for debugging
- [ ] Write unit tests

**Acceptance Criteria:**
- Invalid formats detected
- Oversized files rejected
- Clear error messages shown
- Tests cover edge cases

**Files:**
- `/src/lib/fileValidator.ts`
- `/src/lib/fileValidator.test.ts`

---

### M2-T5: Import State Management
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M2-T3

**Tasks:**
- [ ] Setup Zustand store for import state
- [ ] Define TypeScript types
- [ ] Implement add/remove image actions
- [ ] Implement clear all action
- [ ] Add computed selectors
- [ ] Persist state (optional)
- [ ] Write unit tests

**Acceptance Criteria:**
- State updates correctly
- Multiple images tracked
- Actions work as expected
- No memory leaks

**Files:**
- `/src/stores/importStore.ts`
- `/src/types/import.ts`

---

## Milestone 3: Configuration Module (Week 3-4)

### M3-T1: Size Selection UI
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Create SizeSelector component
- [x] Define preset sizes data structure
- [x] Create checkbox list UI
- [x] Add size preview thumbnails
- [x] Add "Select All" toggle
- [x] Add "Deselect All" toggle
- [x] Add visual size comparison
- [x] Style with Tailwind
- [x] Write unit tests

**Acceptance Criteria:**
- [x] All preset sizes displayed
- [x] Checkboxes toggle correctly
- [x] Select all/deselect all work
- [x] UI is responsive

**Files:**
- `/src/components/configure/SizeSelector.tsx`
- `/src/components/configure/SizeCheckbox.tsx`
- `/src/lib/presetSizes.ts`

**Notes:** Integrated with custom size input toggle and quick presets.

---

### M3-T2: Custom Size Input
**Priority:** P1 | **Estimate:** 4h | **Dependencies:** M3-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04 | **Commit:** d623bbf

**Tasks:**
- [x] Create CustomSizeInput component
- [x] Add width input field
- [x] Add height input field
- [x] Add aspect ratio lock toggle
- [x] Add validation (min/max, numbers only)
- [x] Add "Add to Selection" button
- [x] Handle duplicate sizes
- [x] Write unit tests

**Acceptance Criteria:**
- [x] Custom sizes can be entered
- [x] Validation prevents invalid input (1px - 10000px)
- [x] Aspect ratio lock works (1:1)
- [x] Added to selection correctly
- [x] Duplicate detection prevents same size
- [x] Visual list shows added custom sizes
- [x] Delete functionality for custom sizes

**Files:**
- `/src/components/configure/CustomSizeInput.tsx`
- `/src/components/configure/CustomSizeInput.test.tsx`

**Notes:** Includes comprehensive validation, aspect ratio lock, and 11 test cases.

---

### M3-T3: Format Selection UI
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Create FormatSelector component
- [x] Define supported formats data
- [x] Create checkbox/toggle UI
- [x] Add format icons/logos
- [x] Add format descriptions
- [x] Add compatibility warnings
- [x] Add "Select All" toggle
- [x] Style component
- [x] Write unit tests

**Acceptance Criteria:**
- [x] All formats displayed
- [x] Selection works correctly
- [x] Warnings show when appropriate
- [x] UI is clear and intuitive

**Files:**
- `/src/components/configure/FormatSelector.tsx`
- `/src/lib/supportedFormats.ts`

---

### M3-T4: Preset Configurations
**Priority:** P1 | **Estimate:** 6h | **Dependencies:** M3-T1, M3-T3
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04 | **Commit:** d623bbf

**Tasks:**
- [x] Define preset configurations (Web, Mobile, Desktop, All)
- [x] Create PresetConfigurations component
- [x] Implement preset application logic
- [x] Add preset preview (show what will be generated)
- [x] Add "Save as Preset" functionality
- [x] Implement preset management (edit, delete)
- [x] Persist presets to storage
- [x] Write unit tests

**Acceptance Criteria:**
- [x] Presets apply correctly
- [x] Custom presets can be saved
- [x] Presets persist across sessions (localStorage)
- [x] Management functions work (edit, delete, load)
- [x] Visual metadata display (sizes/formats count)

**Files:**
- `/src/components/configure/PresetConfigurations.tsx`
- `/src/components/configure/PresetConfigurations.test.tsx`

**Notes:** Includes save/load/edit/delete functionality with localStorage persistence. 13 test cases.

---

### M3-T5: Configuration State Management
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M3-T1, M3-T3
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Setup Zustand store for configuration
- [x] Define TypeScript types
- [x] Implement size selection actions
- [x] Implement format selection actions
- [x] Implement preset actions
- [x] Add validation logic
- [x] Add computed selectors
- [x] Write unit tests

**Acceptance Criteria:**
- [x] Configuration state is consistent
- [x] Actions update state correctly
- [x] Validation works
- [x] No race conditions
- [x] Custom sizes supported

**Files:**
- `/src/stores/configStore.ts`
- `/src/types/config.ts`

**Notes:** Zustand store with full CRUD for custom sizes and formats.

---

## Milestone 4: Image Processing Engine (Week 4-6)

### M4-T1: Sharp Integration Setup
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Create sharp-processor Node.js module
- [ ] Install Sharp dependency
- [ ] Setup TypeScript configuration
- [ ] Create basic conversion function
- [ ] Test Sharp installation
- [ ] Document Sharp API usage
- [ ] Write unit tests

**Acceptance Criteria:**
- Sharp installed and working
- Basic conversion functional
- Tests pass

**Files:**
- `/sharp-processor/src/converter.ts`
- `/sharp-processor/package.json`

---

### M4-T2: Format Conversion Implementation
**Priority:** P0 | **Estimate:** 10h | **Dependencies:** M4-T1

**Tasks:**
- [ ] Implement PNG conversion
- [ ] Implement JPG conversion (with quality setting)
- [ ] Implement WebP conversion
- [ ] Implement ICO conversion (multi-size)
- [ ] Implement BMP conversion
- [ ] Handle transparency correctly
- [ ] Handle color profiles
- [ ] Add error handling
- [ ] Write integration tests

**Acceptance Criteria:**
- All formats convert correctly
- Quality settings work
- Transparency preserved
- Errors handled gracefully

**Files:**
- `/sharp-processor/src/converter.ts`
- `/sharp-processor/src/formats/`

---

### M4-T3: Resize Implementation
**Priority:** P0 | **Estimate:** 8h | **Dependencies:** M4-T1

**Tasks:**
- [ ] Implement resize function
- [ ] Support exact dimensions
- [ ] Support aspect ratio preservation
- [ ] Support stretch-to-fit
- [ ] Implement resize algorithms (lanczos3, cubic, etc.)
- [ ] Handle upscaling warnings
- [ ] Add background color for non-square
- [ ] Write unit tests

**Acceptance Criteria:**
- Resizing works accurately
- Quality is maintained
- Edge cases handled
- Tests cover scenarios

**Files:**
- `/sharp-processor/src/resizer.ts`
- `/sharp-processor/src/resizer.test.ts`

---

### M4-T4: Quality Settings
**Priority:** P1 | **Estimate:** 4h | **Dependencies:** M4-T2

**Tasks:**
- [ ] Define quality presets (Low, Medium, High, Lossless)
- [ ] Implement quality parameter mapping
- [ ] Add compression settings for JPG/WebP
- [ ] Add PNG compression level
- [ ] Test quality vs file size
- [ ] Document quality recommendations
- [ ] Write tests

**Acceptance Criteria:**
- Quality presets work
- File size varies appropriately
- Visual quality matches expectations

**Files:**
- `/sharp-processor/src/quality.ts`

---

### M4-T5: Tauri Command Integration
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M4-T2, M4-T3

**Tasks:**
- [ ] Create Tauri commands for image processing
- [ ] Implement invoke handlers in Rust
- [ ] Setup Node.js sidecar communication
- [ ] Handle IPC serialization
- [ ] Add error propagation
- [ ] Add progress events
- [ ] Write integration tests

**Acceptance Criteria:**
- Frontend can invoke processing
- Results returned correctly
- Errors propagated
- Progress updates work

**Files:**
- `/src-tauri/src/commands/image_processing.rs`
- `/src-tauri/src/image/mod.rs`

---

### M4-T6: Error Handling & Recovery
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M4-T5

**Tasks:**
- [ ] Define error types
- [ ] Implement error categorization
- [ ] Add retry logic for transient errors
- [ ] Add fallback processing options
- [ ] Create user-friendly error messages
- [ ] Add error logging
- [ ] Write tests

**Acceptance Criteria:**
- Errors categorized correctly
- Recovery attempts work
- Users see clear messages
- Errors logged for debugging

**Files:**
- `/sharp-processor/src/errors.ts`
- `/src-tauri/src/errors.rs`

---

## Milestone 5: Batch Processing (Week 6-7)

### M5-T1: Batch Queue Management
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M4-T5

**Tasks:**
- [ ] Create BatchQueue class
- [ ] Implement job enqueueing
- [ ] Implement job dequeuing
- [ ] Add job prioritization
- [ ] Add job status tracking
- [ ] Implement queue persistence
- [ ] Write unit tests

**Acceptance Criteria:**
- Jobs added to queue correctly
- Status tracked accurately
- Queue survives app restart (optional)

**Files:**
- `/sharp-processor/src/batch.ts`
- `/src/stores/batchStore.ts`

---

### M5-T2: Parallel Processing
**Priority:** P0 | **Estimate:** 8h | **Dependencies:** M5-T1

**Tasks:**
- [ ] Implement worker pool
- [ ] Configure concurrent job limit
- [ ] Add CPU detection for optimal workers
- [ ] Implement job distribution
- [ ] Handle worker failures
- [ ] Add resource monitoring
- [ ] Write stress tests

**Acceptance Criteria:**
- Multiple jobs process simultaneously
- Resource usage is reasonable
- Failures handled gracefully
- Performance scales with cores

**Files:**
- `/sharp-processor/src/workerPool.ts`

---

### M5-T3: Progress Tracking
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M5-T2

**Tasks:**
- [ ] Create ProgressTracker class
- [ ] Implement per-job progress
- [ ] Implement overall progress
- [ ] Add ETA calculation
- [ ] Emit progress events
- [ ] Create progress display component
- [ ] Write unit tests

**Acceptance Criteria:**
- Progress updates in real-time
- ETA is reasonably accurate
- UI reflects progress correctly

**Files:**
- `/sharp-processor/src/progress.ts`
- `/src/components/output/ProgressBar.tsx`

---

### M5-T4: Cancel Functionality
**Priority:** P1 | **Estimate:** 4h | **Dependencies:** M5-T2

**Tasks:**
- [ ] Implement cancel signal
- [ ] Add cancellation to worker pool
- [ ] Handle in-progress job cancellation
- [ ] Clean up partial outputs
- [ ] Update UI on cancel
- [ ] Add confirmation dialog
- [ ] Write tests

**Acceptance Criteria:**
- Cancellation stops processing
- Partial files handled
- UI updates correctly
- No resource leaks

**Files:**
- `/sharp-processor/src/cancellation.ts`

---

### M5-T5: Performance Optimization
**Priority:** P1 | **Estimate:** 8h | **Dependencies:** M5-T2

**Tasks:**
- [ ] Profile processing performance
- [ ] Identify bottlenecks
- [ ] Optimize memory usage
- [ ] Implement streaming where possible
- [ ] Add caching for repeated operations
- [ ] Tune worker pool size
- [ ] Benchmark improvements
- [ ] Document performance characteristics

**Acceptance Criteria:**
- Processing meets speed targets
- Memory usage is stable
- No memory leaks
- Benchmarks documented

---

## Milestone 6: Output Management (Week 7-8)

### M6-T1: Output Directory Selection
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M1-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Create OutputDirectorySelector component
- [x] Integrate Tauri folder dialog API
- [x] Add "Use Last Location" option
- [x] Add "Use Default" option
- [x] Display selected path
- [x] Validate write permissions
- [x] Write tests

**Acceptance Criteria:**
- [x] Folder dialog works
- [x] Path displayed correctly
- [x] Permissions validated
- [x] Options work as expected
- [x] Remember last path option

**Files:**
- `/src/components/output/DirectorySelector.tsx`
- `/src-tauri/src/commands/folder_dialog.rs`

**Notes:** Includes path persistence option and fallback handling.

---

### M6-T2: Naming Convention System
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M6-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Define naming patterns
- [x] Create NamingConvention component
- [x] Implement pattern variables ({name}, {size}, {format})
- [x] Add preview of resulting names
- [x] Validate naming patterns
- [x] Handle conflicts
- [x] Write tests

**Acceptance Criteria:**
- [x] Patterns work correctly
- [x] Preview shows accurate names
- [x] Conflicts detected
- [x] Validation prevents errors
- [x] Quick templates provided
- [x] Available variables reference

**Files:**
- `/src/components/output/NamingConvention.tsx`
- `/src/lib/namingPatterns.ts`

**Notes:** Includes 4 quick templates, pattern validation, and example preview.

---

### M6-T3: Folder Organization
**Priority:** P1 | **Estimate:** 6h | **Dependencies:** M6-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Create OrganizationSelector component
- [x] Implement "Flat" structure
- [x] Implement "By Size" structure
- [x] Implement "By Format" structure
- [x] Implement "By Size and Format" structure
- [x] Create folder structure on output
- [x] Write tests

**Acceptance Criteria:**
- [x] All organization options work
- [x] Folders created correctly
- [x] Files placed in correct locations
- [x] Visual examples for each option
- [x] Recommendation provided

**Files:**
- `/src/components/output/OrganizationSelector.tsx`
- `/sharp-processor/src/organizer.ts`

**Notes:** 4 organization options with visual examples and recommendations.

---

### M6-T4: File Conflict Handling
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M6-T2
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Detect existing files
- [x] Create conflict resolution UI
- [x] Implement "Skip" option
- [x] Implement "Overwrite" option
- [x] Implement "Rename" option
- [x] Implement "Apply to All" option
- [x] Write tests

**Acceptance Criteria:**
- [x] Conflicts detected before write
- [x] All resolution options work
- [x] User preferences respected
- [x] Backend handles conflict resolution

**Files:**
- `/src/components/output/OutputPanel.tsx`
- `/sharp-processor/src/conflicts.ts`

**Notes:** Conflict handling integrated in batch_convert backend command.

---

### M6-T5: Post-Processing Actions
**Priority:** P1 | **Estimate:** 4h | **Dependencies:** M6-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04

**Tasks:**
- [x] Add "Open Folder" button
- [x] Add "Copy to Clipboard" option
- [x] Add "Show in File Manager" option
- [x] Implement platform-specific file manager opening
- [x] Add completion notification
- [x] Write tests

**Acceptance Criteria:**
- [x] Folder opens correctly on all platforms
- [x] Clipboard copy works
- [x] Notifications display
- [x] Conversion result summary shown

**Files:**
- `/src/components/output/OutputPanel.tsx`
- `/src-tauri/src/commands/open_folder.rs`

**Notes:** Auto-open folder after conversion based on settings. Shows success/failure summary.

---

## Milestone 7: Polish & Settings (Week 8-9)

### M7-T1: Settings Panel
**Priority:** P1 | **Estimate:** 6h | **Dependencies:** M1-T1

**Tasks:**
- [ ] Create SettingsPanel component
- [ ] Add General settings section
- [ ] Add Output settings section
- [ ] Add Performance settings section
- [ ] Add About section
- [ ] Implement settings persistence
- [ ] Add settings reset option
- [ ] Write tests

**Acceptance Criteria:**
- All settings accessible
- Changes persist across sessions
- Reset works correctly

**Files:**
- `/src/components/settings/SettingsPanel.tsx`
- `/src/stores/settingsStore.ts`

---

### M7-T2: Theme System
**Priority:** P1 | **Estimate:** 6h | **Dependencies:** M7-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04 | **Commit:** b2103c7

**Tasks:**
- [x] Define theme configurations (dark, light, system)
- [x] Implement theme provider (useTheme hook)
- [x] Add theme toggle UI (ThemeToggle component)
- [x] Style all components for both themes
- [x] Add theme persistence (localStorage)
- [x] Test all components in both themes
- [x] Write unit tests

**Acceptance Criteria:**
- [x] Both themes fully styled
- [x] Toggle works instantly
- [x] Theme persists
- [x] No visual issues
- [x] System theme detection works
- [x] Auto-switch on system theme change

**Files:**
- `/src/hooks/useTheme.ts`
- `/src/components/ui/ThemeToggle.tsx`
- `/src/components/ui/dropdown-menu.tsx`
- `/src/index.css` (CSS variables)

**Notes:** Dropdown menu with Light/Dark/System options. System theme auto-detection with live switching.

---

### M7-T3: Keyboard Shortcuts
**Priority:** P2 | **Estimate:** 4h | **Dependencies:** M7-T1
**Status:** ✅ **COMPLETE** | **Completed:** 2026-03-04 | **Commit:** 3d8ba5c

**Tasks:**
- [x] Define shortcut mappings
- [x] Implement shortcut listener (useKeyboardShortcuts hook)
- [x] Add shortcuts for common actions
- [x] Create shortcuts help dialog
- [x] Add shortcut customization support
- [x] Handle platform differences (Cmd vs Ctrl)
- [x] Write tests

**Acceptance Criteria:**
- [x] Shortcuts trigger actions
- [x] Help dialog shows all shortcuts
- [x] Platform differences handled
- [x] Shortcuts work globally (configurable)
- [x] Ignore when typing in inputs
- [x] Visual keyboard shortcuts help

**Files:**
- `/src/lib/shortcuts.ts`
- `/src/hooks/useKeyboardShortcuts.ts`
- `/src/components/settings/ShortcutsHelp.tsx`

**Notes:** 14 shortcuts across 4 categories (General, Navigation, Actions, View). Platform-aware modifiers.

---

### M7-T4: About & Help
**Priority:** P2 | **Estimate:** 3h | **Dependencies:** M7-T1

**Tasks:**
- [ ] Create About dialog
- [ ] Add version information
- [ ] Add credits
- [ ] Add license information
- [ ] Create Help documentation
- [ ] Add "Check for Updates" (optional)
- [ ] Write tests

**Acceptance Criteria:**
- About dialog displays correctly
- Information is accurate
- Help is accessible

**Files:**
- `/src/components/settings/AboutDialog.tsx`

---

## Milestone 8: Testing & QA (Week 9-10)

### M8-T1: Unit Test Suite
**Priority:** P0 | **Estimate:** 16h | **Dependencies:** All feature tasks

**Tasks:**
- [ ] Achieve >80% code coverage
- [ ] Test all utility functions
- [ ] Test all components
- [ ] Test all stores
- [ ] Test all Rust functions
- [ ] Setup coverage reporting
- [ ] Fix failing tests
- [ ] Document test strategy

**Acceptance Criteria:**
- Coverage target met
- All tests passing
- Coverage report available

---

### M8-T2: Integration Test Suite
**Priority:** P0 | **Estimate:** 12h | **Dependencies:** M8-T1

**Tasks:**
- [ ] Test import-to-output flow
- [ ] Test configuration persistence
- [ ] Test batch processing
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Setup test data
- [ ] Document test cases

**Acceptance Criteria:**
- All flows tested
- Edge cases covered
- Tests are maintainable

---

### M8-T3: E2E Test Suite
**Priority:** P0 | **Estimate:** 12h | **Dependencies:** M8-T2

**Tasks:**
- [ ] Setup Playwright
- [ ] Create E2E test scenarios
- [ ] Test on Windows
- [ ] Test on macOS
- [ ] Test on Linux
- [ ] Setup CI integration
- [ ] Add visual regression testing
- [ ] Document E2E strategy

**Acceptance Criteria:**
- Critical paths tested
- Cross-platform coverage
- Tests run in CI

---

### M8-T4: Performance Testing
**Priority:** P1 | **Estimate:** 8h | **Dependencies:** M5-T5

**Tasks:**
- [ ] Define performance benchmarks
- [ ] Create performance test suite
- [ ] Test startup time
- [ ] Test conversion speed
- [ ] Test memory usage
- [ ] Test large batches
- [ ] Document results
- [ ] Optimize if needed

**Acceptance Criteria:**
- Performance targets met
- Benchmarks documented
- No regressions

---

### M8-T5: Bug Fix Sprint
**Priority:** P0 | **Estimate:** 16h | **Dependencies:** M8-T1, M8-T2, M8-T3

**Tasks:**
- [ ] Triage all discovered bugs
- [ ] Prioritize bug fixes
- [ ] Fix critical bugs
- [ ] Fix high-priority bugs
- [ ] Regression testing
- [ ] Update bug tracker
- [ ] Document known issues

**Acceptance Criteria:**
- No critical bugs
- High-priority bugs addressed
- Known issues documented

---

## Milestone 9: Release Preparation (Week 10-11)

### M9-T1: Code Signing Setup
**Priority:** P0 | **Estimate:** 6h | **Dependencies:** M1-T2

**Tasks:**
- [ ] Obtain code signing certificate (Windows)
- [ ] Obtain Apple Developer ID (macOS)
- [ ] Configure signing in Tauri
- [ ] Test signed builds
- [ ] Document signing process
- [ ] Setup certificate renewal reminders

**Acceptance Criteria:**
- Builds are signed
- Signatures validate
- Process documented

---

### M9-T2: Installer Generation
**Priority:** P0 | **Estimate:** 4h | **Dependencies:** M9-T1

**Tasks:**
- [ ] Configure Windows installer (NSIS/MSI)
- [ ] Configure macOS installer (DMG/PKG)
- [ ] Configure Linux installer (AppImage/DEB)
- [ ] Test installation on clean systems
- [ ] Test uninstallation
- [ ] Document installation process

**Acceptance Criteria:**
- Installers generated for all platforms
- Installation works smoothly
- Uninstallation clean

---

### M9-T3: Documentation Finalization
**Priority:** P0 | **Estimate:** 8h | **Dependencies:** All milestones

**Tasks:**
- [ ] Complete user documentation
- [ ] Complete API documentation
- [ ] Create user guide
- [ ] Create FAQ
- [ ] Create troubleshooting guide
- [ ] Review and edit all docs
- [ ] Publish documentation

**Acceptance Criteria:**
- All documentation complete
- Docs are clear and accurate
- Published and accessible

---

### M9-T4: Release Notes
**Priority:** P0 | **Estimate:** 3h | **Dependencies:** All milestones

**Tasks:**
- [ ] Compile feature list
- [ ] Document known issues
- [ ] Write upgrade guide
- [ ] Create changelog
- [ ] Review and approve
- [ ] Publish with release

**Acceptance Criteria:**
- Release notes comprehensive
- Clear and accurate
- Published with release

---

### M9-T5: Distribution Setup
**Priority:** P1 | **Estimate:** 6h | **Dependencies:** M9-T2

**Tasks:**
- [ ] Setup GitHub Releases
- [ ] Configure auto-update (optional)
- [ ] Create download page
- [ ] Setup analytics (opt-in)
- [ ] Test download and install flow
- [ ] Document distribution process

**Acceptance Criteria:**
- Releases published
- Downloads work
- Analytics configured

---

## Summary Statistics

| Milestone | Total Tasks | P0 Tasks | P1 Tasks | P2 Tasks | Est. Hours |
|-----------|-------------|----------|----------|----------|------------|
| M1: Foundation | 5 | 3 | 2 | 0 | 17 |
| M2: Import | 5 | 4 | 0 | 0 | 26 |
| M3: Configuration | 5 | 3 | 2 | 0 | 26 |
| M4: Processing Engine | 6 | 4 | 1 | 0 | 38 |
| M5: Batch Processing | 5 | 3 | 2 | 0 | 32 |
| M6: Output Management | 5 | 3 | 2 | 0 | 24 |
| M7: Polish & Settings | 4 | 0 | 2 | 2 | 19 |
| M8: Testing & QA | 5 | 4 | 1 | 0 | 64 |
| M9: Release | 5 | 4 | 1 | 0 | 27 |
| **TOTAL** | **45** | **28** | **13** | **2** | **273** |

---

## Dependency Graph

```
M1 (Foundation)
    │
    ├──► M2 (Import) ──► M3 (Config) ──► M4 (Processing)
    │                        │                 │
    │                        │                 ▼
    │                        │            M5 (Batch)
    │                        │                 │
    │                        ▼                 ▼
    │                   M6 (Output) ◄──────────┘
    │                        │
    │                        ▼
    └──────────────────► M7 (Polish) ──► M8 (QA) ──► M9 (Release)
```

---

## Critical Path

```
M1 → M2 → M3 → M4 → M5 → M6 → M8 → M9
     (Total: ~10 weeks minimum)
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-03-03  
**Status:** Ready for Execution  
**Total Estimated Effort:** 273 hours (~7 weeks at 40h/week with parallelization)
