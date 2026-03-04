# Iconizer Release Guide

This guide covers the complete release process for Iconizer across all platforms.

## Prerequisites

### Windows
- Visual Studio Build Tools 2022+ with C++ workload
- WiX Toolset v3 (for MSI installer)
- Optional: Code signing certificate

### macOS
- Xcode 15.0+
- Apple Developer ID (for code signing)
- Notarization credentials

### Linux
- Build essentials: `sudo apt install build-essential`
- libvips: `sudo apt install libvips-dev`
- rpm/fpm for package creation

## Version Numbering

Iconizer follows [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Pre-release versions use hyphen suffix:
- `1.0.0-alpha.1` - First alpha
- `1.0.0-beta.1` - First beta
- `1.0.0-rc.1` - First release candidate

## Release Checklist

### Pre-Release

- [ ] All tests passing (`pnpm test`, `pnpm test:e2e`)
- [ ] Code coverage >80%
- [ ] No critical bugs in issue tracker
- [ ] Documentation up to date
- [ ] CHANGELOG.md updated
- [ ] Version number updated in:
  - `package.json`
  - `src-tauri/Cargo.toml`
  - `src-tauri/tauri.conf.json`
- [ ] Git repository clean
- [ ] All changes committed and pushed

### Build Process

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test
pnpm test:e2e

# Build for current platform
pnpm tauri build

# Build for all platforms (CI only)
pnpm tauri build --bundles all
```

### Platform-Specific Builds

#### Windows

**NSIS Installer (.exe)**
```bash
pnpm tauri build --target x86_64-pc-windows-msvc
```

Output: `src-tauri/target/release/bundle/nsis/Iconizer_1.0.0_x64-setup.exe`

**MSI Installer**
```bash
pnpm tauri build --target x86_64-pc-windows-msvc -- --bundles msi
```

Output: `src-tauri/target/release/bundle/msi/Iconizer_1.0.0_x64_en-US.msi`

#### macOS

**DMG**
```bash
pnpm tauri build --target x86_64-apple-darwin
pnpm tauri build --target aarch64-apple-darwin  # Apple Silicon
```

Output: `src-tauri/target/release/bundle/dmg/Iconizer_1.0.0_x64.dmg`

**App Bundle**
Output: `src-tauri/target/release/bundle/macos/Iconizer.app`

#### Linux

**AppImage**
```bash
pnpm tauri build --target x86_64-unknown-linux-gnu
```

Output: `src-tauri/target/release/bundle/appimage/Iconizer_1.0.0_amd64.AppImage`

**DEB Package**
```bash
pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles deb
```

Output: `src-tauri/target/release/bundle/deb/iconizer_1.0.0_amd64.deb`

**RPM Package**
```bash
pnpm tauri build --target x86_64-unknown-linux-gnu -- --bundles rpm
```

Output: `src-tauri/target/release/bundle/rpm/iconizer-1.0.0-1.x86_64.rpm`

### Code Signing

#### Windows Code Signing

1. Obtain code signing certificate from trusted CA
2. Install certificate in Windows Certificate Store
3. Configure in `tauri.conf.json`:

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_THUMBPRINT",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

#### macOS Code Signing & Notarization

1. Enroll in Apple Developer Program
2. Create Developer ID Application certificate
3. Create notarization app-specific password
4. Configure environment variables:

```bash
export APPLE_CERTIFICATE="Developer ID Application: Your Name"
export APPLE_ID="your@email.com"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

5. Build with signing:
```bash
pnpm tauri build
```

### Post-Build Verification

#### Verify Signatures

**Windows:**
```powershell
# Verify signature
signtool verify /pa Iconizer_1.0.0_x64-setup.exe

# View certificate
signtool verify /v /pa Iconizer_1.0.0_x64-setup.exe
```

**macOS:**
```bash
# Verify signature
codesign --verify --verbose Iconizer.app

# Check notarization
spctl --assess --type execute --verbose Iconizer.app
```

**Linux:**
```bash
# Verify AppImage
./Iconizer_1.0.0_amd64.AppImage --appimage-extract && rm -rf squashfs-root

# Verify DEB package
dpkg-deb --info iconizer_1.0.0_amd64.deb
dpkg-deb --field iconizer_1.0.0_amd64.deb
```

#### Test Installation

Test on clean systems for each platform:

1. **Windows 10/11** (clean VM)
2. **macOS 11+** (clean VM)
3. **Ubuntu 20.04+** (clean VM)

Verify:
- [ ] Installer runs without errors
- [ ] Application launches successfully
- [ ] All features work correctly
- [ ] Uninstallation removes all files
- [ ] No security warnings (if signed)

### Release Distribution

#### GitHub Releases

1. Create release on GitHub
2. Upload all build artifacts:
   - Windows: `.exe`, `.msi`
   - macOS: `.dmg`, `.app`
   - Linux: `.AppImage`, `.deb`, `.rpm`
3. Add release notes
4. Tag release: `v1.0.0`

#### Release Notes Template

```markdown
## Iconizer v1.0.0

### 🎉 What's New

- Feature 1
- Feature 2
- Feature 3

### 🐛 Bug Fixes

- Fix 1
- Fix 2

### 📝 Notes

- Important note 1
- Important note 2

### 📦 Downloads

- **Windows**: [Iconizer_1.0.0_x64-setup.exe](link)
- **macOS**: [Iconizer_1.0.0_x64.dmg](link)
- **Linux**: [Iconizer_1.0.0_amd64.AppImage](link)

### ✅ Checksums

- SHA256 (Windows): `abc123...`
- SHA256 (macOS): `def456...`
- SHA256 (Linux): `ghi789...`
```

### Automated Releases (CI/CD)

GitHub Actions workflow for automated releases:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Build
        run: pnpm tauri build
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: iconizer-${{ matrix.os }}
          path: src-tauri/target/release/bundle/
```

### Rollback Procedure

If issues are discovered post-release:

1. **Immediately**: Mark release as pre-release on GitHub
2. **Assess**: Determine severity of issue
3. **Fix**: Create hotfix branch, implement fix
4. **Test**: Run full test suite
5. **Patch Release**: Release as `1.0.1`
6. **Communicate**: Update release notes, notify users

### Support

For release-related issues:
- GitHub Issues: https://github.com/dream-pixels-forge/iconizer/issues
- Email: support@dreampixelsforge.com

---

**Last Updated:** 2026-03-04  
**Version:** 1.0.0-mvp
