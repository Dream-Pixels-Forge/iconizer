# Iconizer v1.1.0 - Development Planning Notes

**Version:** 1.1.0
**Status:** 📋 Planning Phase
**Created:** 2026-03-04
**Last Updated:** 2026-03-04

---

## 🎯 Session Notes - 2026-03-04

### Context

After successfully completing v1.0.0-mvp, we're starting planning for v1.1.0. This version will focus on **power user features** while maintaining the simplicity that makes Iconizer accessible.

### Key Decisions

1. **Priority Order:**
   - P0: Batch editing (most requested feature)
   - P0: Performance improvements (2x speed target)
   - P1: Extended formats (AVIF, HEIC)
   - P1: Cloud sync (presets only for v1.1.0)
   - P2: Developer tools (CLI, API)

2. **Out of Scope:**
   - Mobile apps (v2.0+)
   - Web version (v2.0+)
   - AI features (future consideration)
   - Subscription model (not decided)

3. **Timeline:**
   - Target: Q2 2026 (April-July)
   - 6 milestones over 5 months
   - Buffer time for testing and polish

---

## 📋 Feature Research

### Batch Editing - User Stories

From user feedback and market research:

**David (Frontend Developer):**
> "I need to process 50+ icons for a project. Each one needs the same brightness adjustment and watermark. Doing this one-by-one is painful."

**Sarah (UI/UX Designer):**
> "I want to create a consistent look across all my exported assets. Being able to save my adjustments as a preset would save hours."

**Marcus (Content Creator):**
> "Social media requires different sizes and formats. I'd love to batch convert, resize, AND add my logo in one go."

### Technical Approach - Batch Editing

**Architecture:**
```
src/
  components/
    batch-editor/
      AdjustmentPanel.tsx      # Sliders for brightness, contrast, etc.
      FilterPanel.tsx          # Filter selection and preview
      TransformPanel.tsx       # Crop, rotate, resize
      WatermarkPanel.tsx       # Text and image overlays
      BatchPreview.tsx         # Before/after comparison
  stores/
    adjustmentStore.ts         # Zustand store for adjustments
  lib/
    adjustmentPipeline.ts      # Image processing pipeline
    filterDefinitions.ts       # Filter configurations
```

**Processing Pipeline:**
```
Source Image
    ↓
[Adjustment Layer] → Brightness/Contrast/Saturation
    ↓
[Color Layer] → Hue, Color Balance, Vibrance
    ↓
[Filter Layer] → Grayscale, Sepia, Blur, Sharpen
    ↓
[Transform Layer] → Crop, Rotate, Resize
    ↓
[Overlay Layer] → Watermark, Logo
    ↓
Output Image
```

### Performance Optimization Strategy

**Current Bottleneck (v1.0.0):**
- Single-threaded processing
- Full image load for each operation
- No caching between operations

**v1.1.0 Improvements:**
1. **Worker Threads:** Parallel processing for batches
2. **Streaming:** Process large images without full load
3. **Caching:** Store intermediate results
4. **GPU:** Offload color operations to GPU

**Expected Gains:**
- 2x faster for 100+ image batches
- 50% less memory usage
- Real-time preview for adjustments

---

## 🔧 Technical Spikes Needed

### Spike 1: GPU Acceleration Research
**Owner:** TBD
**Duration:** 1 week
**Questions:**
- Which GPU API? (WebGPU, OpenCL, Vulkan)
- Browser support for WebGPU
- Fallback strategy for integrated graphics
- Performance benchmarks vs CPU

### Spike 2: AVIF/HEIC Implementation
**Owner:** TBD
**Duration:** 3 days
**Questions:**
- Best Rust crates for AVIF (rav1e, libavif)
- HEIC decoding options
- Licensing considerations
- Performance impact

### Spike 3: Cloud Sync Architecture
**Owner:** TBD
**Duration:** 1 week
**Questions:**
- Self-hosted vs third-party (Supabase, Firebase)
- End-to-end encryption approach
- Offline-first sync strategy
- Conflict resolution algorithm

---

## 📊 Competitive Analysis

### XnConvert
**Strengths:**
- 100+ operations available
- Very fast processing
- Cross-platform

**Weaknesses:**
- Complex, dated UI
- Steep learning curve
- No preset cloud sync

**Opportunity:** Simpler UI with 80% of features

---

### Squoosh (Web)
**Strengths:**
- Beautiful, intuitive UI
- Real-time comparison
- Google-backed

**Weaknesses:**
- Web-based (privacy concerns)
- Limited batch features
- No desktop app

**Opportunity:** Desktop privacy + same UX quality

---

### Bulk Image Processor (Various)
**Strengths:**
- Fast batch operations
- Simple workflows

**Weaknesses:**
- Limited editing capabilities
- Poor UI/UX
- Platform-specific

**Opportunity:** Best-in-class editing + batch speed

---

## 🎨 Design Considerations

### Adjustment Panel Layout

**Option A: Accordion Panels**
```
┌─────────────────────────┐
│ ▼ Brightness/Contrast  │
│   [====○====] Brightness│
│   [====○====] Contrast  │
├─────────────────────────┤
│ ▶ Color Correction      │
├─────────────────────────┤
│ ▶ Filters & Effects     │
├─────────────────────────┤
│ ▶ Transform             │
└─────────────────────────┘
```

**Option B: Tabbed Interface**
```
┌─────────────────────────┐
│ [Adjust] [Color] [Filter]│
├─────────────────────────┤
│                         │
│   Adjustment Controls   │
│                         │
└─────────────────────────┘
```

**Option C: Floating Panels**
```
┌──────────┐  ┌──────────┐
│Brightness│  │  Color   │
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│  Filter  │  │ Transform│
└──────────┘  └──────────┘
```

**Decision:** Option A (Accordion) - Best for vertical space, familiar pattern

---

## 📈 Success Metrics Definition

### Processing Speed
**Measurement:** Time to process 100 images (1000x1000px) with 3 adjustments

- **v1.0.0 Baseline:** ~100 seconds
- **v1.1.0 Target:** ~50 seconds (2x improvement)
- **Stretch Goal:** ~30 seconds (3.3x improvement)

### Memory Usage
**Measurement:** Peak memory during batch of 50 images

- **v1.0.0 Baseline:** ~500MB
- **v1.1.0 Target:** ~300MB (40% reduction)
- **Stretch Goal:** ~200MB (60% reduction)

### User Efficiency
**Measurement:** Average actions to complete common task

- **v1.0.0 Baseline:** 5 actions
- **v1.1.0 Target:** 3 actions (presets, batch apply)

### Format Coverage
**Measurement:** Percentage of top 20 image formats supported

- **v1.0.0:** 9/20 formats (45%)
- **v1.1.0:** 12/20 formats (60%)
- **Future:** 18/20 formats (90%)

---

## 🗓️ Sprint Planning Draft

### Sprint 1-2: Foundation (Weeks 1-6)
**Goal:** Basic adjustment infrastructure

**Stories:**
- As a user, I want to adjust brightness so that I can fix exposure
- As a user, I want to adjust contrast so that images pop
- As a user, I want to adjust saturation so that colors are vibrant
- As a user, I want to preview adjustments so that I can see the result

**Technical Tasks:**
- Create adjustment store
- Build adjustment pipeline
- Implement preview system
- Add undo/redo support

---

### Sprint 3-4: Advanced Editing (Weeks 7-10)
**Goal:** Full editing suite

**Stories:**
- As a user, I want to crop images so that I can remove unwanted areas
- As a user, I want to rotate images so that they're oriented correctly
- As a user, I want to add a watermark so that my images are branded
- As a user, I want to save adjustments as presets so that I can reuse them

**Technical Tasks:**
- Implement transform operations
- Build watermark system
- Create preset management
- Add batch apply functionality

---

### Sprint 5-6: Formats & Performance (Weeks 11-14)
**Goal:** Extended formats + speed

**Stories:**
- As a user, I want AVIF support so that I can use the latest format
- As a user, I want HEIC import so that I can use iOS photos
- As a user, I want faster processing so that I can work efficiently

**Technical Tasks:**
- Integrate AVIF encoder/decoder
- Add HEIC decoding
- Implement GPU acceleration
- Build caching system

---

### Sprint 7-8: Cloud & Developer (Weeks 15-18)
**Goal:** Sync + automation

**Stories:**
- As a user, I want my presets to sync so that I can use them on all devices
- As a developer, I want a CLI so that I can automate conversions
- As a developer, I want an API so that I can integrate with my tools

**Technical Tasks:**
- Build cloud sync backend
- Implement CLI tool
- Create Node.js SDK
- Document plugin system

---

### Sprint 9: Polish & Release (Weeks 19-20)
**Goal:** Production-ready release

**Stories:**
- As a user, I want the app to be bug-free so that I can trust it
- As a user, I want clear documentation so that I can learn features
- As a user, I want good performance so that I can work smoothly

**Technical Tasks:**
- Comprehensive testing
- Documentation complete
- Performance optimization
- Release preparation

---

## 📝 Open Questions

### Architecture
1. Should adjustments be implemented in Rust or TypeScript?
   - **Pros (Rust):** Faster, consistent with image processing
   - **Pros (TS):** Easier iteration, more contributors
   - **Leaning toward:** Rust for performance-critical, TS for UI

2. How do we handle undo/redo for batch operations?
   - **Option A:** Command pattern with full state snapshots
   - **Option B:** Delta tracking (only store changes)
   - **Option C:** Limited undo (last N operations)
   - **Leaning toward:** Option B for memory efficiency

### UX
3. Should batch editing be a separate mode or integrated?
   - **Option A:** Separate "Batch Editor" view
   - **Option B:** Integrated in main workflow
   - **Option C:** Hybrid (quick edits inline, advanced in separate view)
   - **Leaning toward:** Option C for best of both

4. How do we show before/after for 50+ images?
   - **Option A:** Grid with hover preview
   - **Option B:** Split view (before left, after right)
   - **Option C:** Slider comparison for selected images
   - **Leaning toward:** Option A + C combination

### Technical
5. Which cloud provider for sync?
   - **Option A:** Supabase (PostgreSQL + storage)
   - **Option B:** Firebase (NoSQL + storage)
   - **Option C:** Self-hosted (full control)
   - **Leaning toward:** Option A (Supabase) for open-source + features

6. GPU API choice?
   - **Option A:** WebGPU (modern, web-focused)
   - **Option B:** OpenCL (mature, cross-platform)
   - **Option C:** Vulkan (maximum performance)
   - **Leaning toward:** Option A (WebGPU) for future-proofing

---

## 🎯 Next Actions

### Immediate (This Week)
- [ ] Review roadmap with stakeholders
- [ ] Create GitHub milestone for v1.1.0
- [ ] Set up project board in GitHub
- [ ] Create issues for M1 tasks
- [ ] Schedule technical spikes

### Short-term (Next 2 Weeks)
- [ ] Complete GPU acceleration spike
- [ ] Complete AVIF/HEIC spike
- [ ] Finalize M1 sprint backlog
- [ ] Set up development environment for team
- [ ] Create design mockups for batch editor

### Medium-term (Next Month)
- [ ] Begin M1 development
- [ ] Weekly sprint reviews
- [ ] User testing for batch editor prototype
- [ ] Performance benchmarking setup

---

## 📞 Resources

### Research Links
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [AVIF Format Documentation](https://aomediacodec.github.io/av1-avif/)
- [HEIF Technical Overview](https://nokiatech.github.io/heif/technical.html)
- [Supabase Documentation](https://supabase.com/docs)

### Competitive Products
- [XnConvert](https://www.xnview.com/en/xnconvert/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)
- [Bulk Image Processor](https://bulkimageprocessor.com/)

### Inspiration
- [Affinity Photo](https://affinity.serif.com/en-us/photo/) - Professional editing UI
- [Photopea](https://www.photopea.com/) - Web-based Photoshop alternative
- [GIMP](https://www.gimp.org/) - Open-source image editor

---

**Document Status:** Draft
**Next Review:** 2026-03-11
**Contributors:** @Patrick (initial draft)

---

*This is a living document. Update as decisions are made and priorities evolve.*
