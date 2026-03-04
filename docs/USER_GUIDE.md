# Iconizer User Guide

**Version:** 1.0.0-mvp  
**Last Updated:** 2026-03-04

Welcome to Iconizer! This guide will help you get the most out of your image conversion tool.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Importing Images](#importing-images)
3. [Configuring Output](#configuring-output)
4. [Conversion Settings](#conversion-settings)
5. [Output Options](#output-options)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Tips & Tricks](#tips--tricks)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

When you first open Iconizer, you'll see three main sections:

1. **Import Images** (Left) - Drag and drop or browse for images
2. **Configuration** (Center) - Select sizes and formats
3. **Output** (Right) - Choose destination and convert

### Quick Start (30 seconds)

1. Drag an image into the import area
2. Click "Web" preset for common web sizes
3. Select PNG and ICO formats
4. Choose output folder
5. Click "Convert Images"

That's it! Your icons are ready.

---

## Importing Images

### Drag & Drop

1. Click and hold an image file
2. Drag it over the import area
3. Release when the area highlights
4. Image appears in the selected list

**Supported Formats:** PNG, JPG, WebP, BMP, GIF, TIFF, SVG

### Browse Files

1. Click "Browse Files" button
2. Navigate to your image
3. Select one or multiple files
4. Click "Open"

### Managing Imported Images

- **Remove Single Image**: Click the X button next to the image
- **Remove All**: Click "Clear All" button
- **View Details**: Image preview shows dimensions and file size

### Image Preview

Click on an imported image to see:
- Full preview with zoom (25% - 400%)
- File name and format
- Dimensions (width × height)
- File size
- Transparency information

**Zoom Controls:**
- Scroll wheel to zoom in/out
- Drag to pan when zoomed in
- Click reset button to return to 100%

---

## Configuring Output

### Selecting Sizes

Iconizer provides 10 preset sizes optimized for different use cases:

#### Favicon Sizes
- **16×16** - Browser favicon
- **24×24** - Small icons
- **32×32** - Taskbar icon

#### Icon Sizes
- **48×48** - Desktop icon
- **64×64** - Application icon
- **96×96** - Android launcher
- **128×128** - macOS small icon

#### App Store Sizes
- **256×256** - macOS icon, Windows icon
- **512×512** - PWA icon, Android
- **1024×1024** - App Store, Play Store

### Quick Presets

Save time with one-click presets:

| Preset | Sizes Included | Best For |
|--------|---------------|----------|
| **Web** | 16×16, 32×32, 48×48 | Websites, favicons |
| **Mobile** | 96×96, 512×512, 1024×1024 | Mobile apps, PWAs |
| **Desktop** | 48×48, 64×64, 128×128, 256×256 | Desktop applications |
| **All Sizes** | All 10 sizes | Complete coverage |

### Custom Sizes

Need a specific size not in presets?

1. Click "Add Custom Size"
2. Enter width and height (1 - 10000 pixels)
3. Optionally lock aspect ratio (1:1)
4. Click "Add Custom Size" button

Custom sizes appear in a list below the input. Click the trash icon to remove.

### Selecting Formats

Choose output formats by checking the boxes:

| Format | Transparency | Quality Settings | Best For |
|--------|-------------|------------------|----------|
| **PNG** | ✅ Yes | Lossless | Web graphics, icons |
| **JPG** | ❌ No | Yes (0-100) | Photos |
| **WebP** | ✅ Yes | Yes (0-100) | Modern web |
| **ICO** | ✅ Yes | N/A | Windows icons |
| **BMP** | ❌ No | N/A | Legacy systems |

**Format Tips:**
- Use PNG for graphics with transparency
- Use JPG for photos (smaller file size)
- Use WebP for modern web (best compression)
- Use ICO for Windows application icons

---

## Conversion Settings

### Quality Settings

For formats that support quality settings (JPG, WebP):

- **Low (0-30)**: Smallest file, visible artifacts
- **Medium (31-70)**: Good balance
- **High (71-90)**: Excellent quality (recommended)
- **Lossless (91-100)**: Maximum quality, larger files

### Aspect Ratio

- **Maintain Aspect Ratio**: Image scaled proportionally
- **Stretch to Fit**: Image fills exact dimensions (may distort)

### Background Color

For non-square images converted to square formats:
- Choose background color for letterboxing
- Default: Transparent (if format supports)

---

## Output Options

### Output Location

1. Click folder icon next to "Output Location"
2. Browse to desired folder
3. Click "Select Folder"
4. Path appears in the text field

**Options:**
- ✅ Remember as default location
- ⬜ Use last location (automatic)

### Folder Organization

Choose how to organize your output files:

#### Flat (Recommended for simple projects)
```
output/
  ├── icon-16x16.png
  ├── icon-32x32.png
  └── icon-512x512.png
```

#### By Size
```
output/
  ├── 16x16/
  │   └── icon.png
  ├── 32x32/
  │   └── icon.png
  └── 512x512/
      └── icon.png
```

#### By Format
```
output/
  ├── png/
  │   └── icon-512x512.png
  ├── jpg/
  │   └── icon-512x512.jpg
  └── webp/
      └── icon-512x512.webp
```

#### By Size & Format
```
output/
  ├── 16x16/
  │   ├── png/
  │   └── jpg/
  └── 512x512/
      ├── png/
      └── webp/
```

### Naming Patterns

Customize output file names with variables:

**Available Variables:**
- `{name}` - Original file name
- `{size}` - Output size (e.g., 512x512)
- `{format}` - Output format (e.g., png)
- `{width}` - Output width
- `{height}` - Output height
- `{index}` - Sequential number (001, 002, etc.)

**Quick Templates:**
- **Standard**: `{name}-{size}.{format}` → `myicon-512x512.png`
- **Descriptive**: `{name}_{width}x{height}.{format}` → `myicon_512x512.png`
- **Indexed**: `{name}_{index}.{format}` → `myicon_001.png`
- **Minimal**: `{size}.{format}` → `512x512.png`

### File Conflicts

If output files already exist:

- **Skip**: Keep existing file, don't overwrite
- **Overwrite**: Replace existing file
- **Rename**: Add number suffix (icon-1.png, icon-2.png)
- **Apply to All**: Use same choice for all conflicts

---

## Keyboard Shortcuts

Boost your productivity with keyboard shortcuts:

### General
| Shortcut | Action |
|----------|--------|
| `?` or `Shift+/` | Show keyboard shortcuts help |
| `,` | Open settings |

### Navigation
| Shortcut | Action |
|----------|--------|
| `1` | Jump to Import section |
| `2` | Jump to Sizes section |
| `3` | Jump to Formats section |
| `4` | Jump to Output section |

### Actions
| Shortcut | Action |
|----------|--------|
| `O` or `Ctrl+O` | Open file browser |
| `Ctrl+Enter` | Start conversion |
| `Ctrl+Delete` | Clear all images |
| `Ctrl+A` | Select all sizes |

### View
| Shortcut | Action |
|----------|--------|
| `T` | Toggle theme (Light/Dark) |
| `+` or `Ctrl+=` | Zoom in on preview |
| `-` or `Ctrl+-` | Zoom out on preview |
| `0` | Reset zoom to 100% |

**Note:** On macOS, `Ctrl` is replaced by `Cmd` (⌘) for modifier keys.

---

## Tips & Tricks

### Optimal Workflows

#### Web Developer Workflow
1. Import logo PNG
2. Click "Web" preset
3. Select PNG and ICO formats
4. Use "Flat" organization
5. Convert → Get favicon.ico and PNGs

#### Mobile App Developer Workflow
1. Import app icon (1024×1024)
2. Click "Mobile" preset
3. Select PNG format
4. Use "By Size" organization
5. Convert → Get all app store sizes

#### Desktop App Developer Workflow
1. Import application icon
2. Click "Desktop" preset
3. Select PNG and ICO formats
4. Use "By Format" organization
5. Convert → Get Windows and macOS icons

### Best Practices

1. **Start with High Resolution**: Always use the highest resolution source image
2. **Use PNG for Graphics**: PNG preserves sharp edges and transparency
3. **Test on Target Platform**: Verify icons look good at actual size
4. **Keep Originals**: Don't overwrite your source files
5. **Use Presets**: Save time with quick presets for common tasks

### Performance Tips

- **Batch Processing**: Import multiple images at once
- **Parallel Processing**: Iconizer uses all CPU cores automatically
- **Selective Conversion**: Only generate sizes you actually need
- **SSD Recommended**: Faster read/write on solid-state drives

---

## Troubleshooting

### Common Issues

#### "Unsupported image format"
**Cause:** File format not recognized  
**Solution:** Use PNG, JPG, WebP, ICO, BMP, GIF, TIFF, or SVG

#### "File size exceeds limit"
**Cause:** Image larger than 50MB  
**Solution:** Compress image or reduce dimensions before importing

#### "Invalid dimensions"
**Cause:** Image too small (< 1px) or too large (> 10000px)  
**Solution:** Use an image within valid range

#### Conversion is slow
**Cause:** Large images or many sizes selected  
**Solution:** 
- Reduce number of sizes
- Use fewer formats
- Close other applications

#### Output files are corrupted
**Cause:** Disk full or write error  
**Solution:**
- Check available disk space
- Verify output folder permissions
- Try different output location

#### Icons look blurry
**Cause:** Upscaling from small source  
**Solution:**
- Use larger source image
- Avoid upscaling (warned in preview)
- Generate only sizes ≤ source dimensions

### Getting Help

If you encounter issues not covered here:

1. **Check Documentation**: README.md, this guide
2. **GitHub Issues**: https://github.com/dream-pixels-forge/iconizer/issues
3. **Email Support**: support@dreampixelsforge.com

**When Reporting Issues:**
- Iconizer version (Help → About)
- Operating system and version
- Steps to reproduce
- Screenshot if applicable
- Sample image if possible

---

## Appendix

### System Requirements

**Minimum:**
- OS: Windows 10, macOS 11, Ubuntu 20.04
- CPU: Dual-core 2.0 GHz
- RAM: 4 GB
- Disk: 500 MB free space

**Recommended:**
- OS: Windows 11, macOS 12+, Ubuntu 22.04
- CPU: Quad-core 3.0 GHz+
- RAM: 8 GB
- Disk: SSD with 1 GB free space

### Supported Formats

**Input:** PNG, JPG, JPEG, WebP, BMP, GIF, TIFF, SVG (limited)  
**Output:** ICO, PNG, JPG, WebP, BMP, SVG (traced)

### File Size Limits

- **Maximum File Size:** 50 MB
- **Maximum Dimensions:** 10000 × 10000 pixels
- **Minimum Dimensions:** 1 × 1 pixels
- **Maximum Batch Size:** 100 images

### Color Spaces

Iconizer supports:
- sRGB (default)
- Grayscale
- RGBA (with transparency)

---

**Iconizer v1.0.0-mvp**  
© 2026 Dream Pixels Forge  
MIT License
