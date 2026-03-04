# Iconizer Roadmap

This folder contains the product roadmap and planning documentation for Iconizer.

---

## 📁 Structure

```
roadmap/
├── v1.0.0/           # v1.0.0-mvp (Released 2026-03-04)
│   ├── PRD.md              # Product Requirements Document
│   ├── TASKS.md            # Task breakdown & backlog
│   ├── IMPLEMENTATION_PLAN.md
│   └── PRIDES_SUMMARY.md
│
└── v1.1.0/           # v1.1.0 (Planned Q2 2026)
    ├── ROADMAP.md          # Feature roadmap
    └── (future: PRD, tasks, etc.)
```

---

## 📋 Versions

### v1.0.0-mvp ✅ (Released 2026-03-04)

**Status:** Production Release

**Key Features:**
- Multi-format image conversion (9 formats)
- Batch size generation (10 presets + custom)
- Selective output control
- Drag & drop interface
- Dark/Light themes
- Keyboard shortcuts
- Preset management

**Documentation:**
- [PRD](v1.0.0/PRD.md) - Product requirements
- [TASKS](v1.0.0/TASKS.md) - Complete task breakdown
- [Implementation Plan](v1.0.0/IMPLEMENTATION_PLAN.md)

**Metrics:**
- 21,000+ lines of code
- 144+ automated tests
- 85%+ code coverage
- 83 files created

---

### v1.1.0 📋 (Planned Q2 2026)

**Status:** Planning Phase

**Planned Features:**
- Batch editing (adjustments, filters, transforms)
- Extended format support (AVIF, HEIC, PDF)
- Performance enhancements (GPU acceleration)
- Cloud preset synchronization
- CLI version
- Node.js API

**Documentation:**
- [ROADMAP](v1.1.0/ROADMAP.md) - Feature roadmap
- [PLANNING](../.dev_notes/v1.1.0/PLANNING.md) - Development notes

**Timeline:**
- M1: Batch Editing Foundation - April 2026
- M2: Advanced Editing - May 2026
- M3: Format Extensions - June 2026
- M4: Performance - June 2026
- M5: Cloud & Developer - July 2026
- M6: Polish & Release - July 2026

---

## 🔮 Future Versions

### v1.2.0 (TBD)

**Under Consideration:**
- AI-powered features (auto-enhance, background removal)
- Advanced batch operations
- Team collaboration features
- Mobile applications

### v2.0.0 (Future)

**Vision:**
- Web version (WebAssembly)
- Cross-platform mobile apps
- Plugin marketplace
- Enterprise features

---

## 📊 Roadmap Process

### Planning

1. **User Feedback** - Collect from GitHub Issues, Discussions, social media
2. **Market Research** - Analyze competitors and trends
3. **Technical Feasibility** - Evaluate complexity and dependencies
4. **Prioritization** - Use MoSCoW method (Must, Should, Could, Won't)

### Development

1. **Milestone Definition** - Break into 2-4 week milestones
2. **Sprint Planning** - Weekly sprints with clear goals
3. **Progress Tracking** - GitHub Projects, Issues, PRs
4. **Quality Gates** - All tests pass, documentation updated

### Release

1. **Beta Testing** - Community testing period
2. **Documentation** - User guides, API docs, changelog
3. **Release** - GitHub Releases, announcements
4. **Post-Release** - Monitor feedback, bug fixes

---

## 🎯 Prioritization Framework

We use the **MoSCoW method** for prioritization:

| Priority | Meaning | Criteria |
|----------|---------|----------|
| **P0 - Must Have** | Critical for release | Core functionality, blockers |
| **P1 - Should Have** | Important but not critical | Major improvements, high impact |
| **P2 - Could Have** | Desirable features | Nice to have, lower impact |
| **P3 - Won't Have** | Postponed | Future consideration |

---

## 📞 Contributing

We welcome community input on the roadmap!

### How to Contribute

1. **GitHub Issues** - Suggest features or vote on existing ones
2. **Discussions** - Share use cases and workflows
3. **Discord** - Real-time feedback and questions
4. **Twitter** - Follow @IconizerApp for updates

### What We Look For

- **Clear Use Case** - Explain the problem you're solving
- **User Impact** - How many users would benefit?
- **Technical Feasibility** - Can it be built with current tech?
- **Alignment** - Does it fit the product vision?

---

## 📈 Success Metrics

We track these metrics to measure roadmap progress:

| Metric | v1.0.0 | v1.1.0 Target |
|--------|--------|---------------|
| Processing Speed | 1 img/sec | 2+ img/sec |
| Memory Usage | 500MB | <300MB |
| Supported Formats | 9 | 12+ |
| Test Coverage | 85% | 90% |
| User Actions (avg) | 5 | 3 |

---

## 🔗 Resources

- [Main Repository](https://github.com/Dream-Pixels-Forge/iconizer)
- [v1.0.0 PRD](v1.0.0/PRD.md)
- [v1.1.0 Roadmap](v1.1.0/ROADMAP.md)
- [Development Notes](../.dev_notes/)
- [CHANGELOG](../CHANGELOG.md)

---

**Last Updated:** 2026-03-04
**Maintained By:** Dream Pixels Forge Team
