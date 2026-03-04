use serde::{Deserialize, Serialize};
use tauri::command;
use image::{GenericImageView, ImageFormat, ImageReader};
use std::path::{Path, Component};
use tokio::task::spawn_blocking;

/// Sanitize filename to prevent path traversal and invalid characters
fn sanitize_filename(name: &str) -> String {
    name.chars()
        .map(|c| {
            if c.is_alphanumeric() || c == '-' || c == '_' || c == '.' {
                c
            } else {
                '_'
            }
        })
        .collect()
}

/// Validate that output path is safe (doesn't escape output directory)
fn is_path_safe(output_dir: &Path, full_path: &Path) -> bool {
    match full_path.strip_prefix(output_dir) {
        Ok(relative) => {
            !relative.components().any(|c| c == Component::ParentDir)
        }
        Err(_) => false,
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageMetadata {
    pub name: String,
    pub path: String,
    pub format: String,
    pub width: u32,
    pub height: u32,
    pub size: u64,
    pub has_transparency: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConversionOptions {
    pub target_format: String,
    pub target_width: u32,
    pub target_height: u32,
    pub quality: u8,
    pub maintain_aspect_ratio: bool,
    pub background_color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversionRequest {
    pub source_path: String,
    pub output_path: String,
    pub options: ConversionOptions,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchConversionRequest {
    pub source_paths: Vec<String>,
    pub output_directory: String,
    pub target_formats: Vec<String>,
    pub sizes: Vec<(u32, u32)>,
    pub quality: u8,
    pub organization: String,
    pub naming_pattern: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConversionResult {
    pub success: bool,
    pub output_path: Option<String>,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BatchConversionResult {
    pub total: usize,
    pub successful: usize,
    pub failed: usize,
    pub results: Vec<ConversionResult>,
}

/// Detect image format from file path
fn detect_format(path: &str) -> Option<ImageFormat> {
    let ext = Path::new(path).extension()?.to_str()?.to_lowercase();
    match ext.as_str() {
        "png" => Some(ImageFormat::Png),
        "jpg" | "jpeg" => Some(ImageFormat::Jpeg),
        "webp" => Some(ImageFormat::WebP),
        "bmp" => Some(ImageFormat::Bmp),
        "gif" => Some(ImageFormat::Gif),
        "tiff" | "tif" => Some(ImageFormat::Tiff),
        "ico" => Some(ImageFormat::Ico),
        _ => None,
    }
}

/// Get output format
fn get_output_format(format: &str) -> ImageFormat {
    match format.to_lowercase().as_str() {
        "png" => ImageFormat::Png,
        "jpg" | "jpeg" => ImageFormat::Jpeg,
        "webp" => ImageFormat::WebP,
        "bmp" => ImageFormat::Bmp,
        "gif" => ImageFormat::Gif,
        "tiff" => ImageFormat::Tiff,
        "ico" => ImageFormat::Ico,
        _ => ImageFormat::Png,
    }
}

/// Check if format supports transparency
fn supports_transparency(format: ImageFormat) -> bool {
    matches!(format, ImageFormat::Png | ImageFormat::WebP | ImageFormat::Gif)
}

/// Get metadata for an image file
#[command]
pub async fn get_image_metadata(path: String) -> Result<ImageMetadata, String> {
    let path_clone = path.clone();
    
    let metadata = spawn_blocking(move || {
        // Try to open as image
        let img = match ImageReader::open(&path_clone) {
            Ok(reader) => reader.with_guessed_format()
                .map_err(|e| e.to_string())?
                .decode()
                .map_err(|e| e.to_string())?,
            Err(e) => return Err(format!("Failed to open image: {}", e)),
        };
        
        let (width, height) = img.dimensions();
        
        let file_metadata = std::fs::metadata(&path_clone)
            .map_err(|e| e.to_string())?;
        
        let format = detect_format(&path_clone)
            .map(|f| format!("{:?}", f))
            .unwrap_or_else(|| "unknown".to_string());
        
        let has_transparency = detect_format(&path_clone)
            .map(|f| supports_transparency(f))
            .unwrap_or(false);

        Ok::<ImageMetadata, String>(ImageMetadata {
            name: Path::new(&path_clone)
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string(),
            path,
            format,
            width,
            height,
            size: file_metadata.len(),
            has_transparency,
        })
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(metadata)
}

/// Convert a single image
#[command]
pub async fn convert_image(request: ConversionRequest) -> Result<ConversionResult, String> {
    let source_path = request.source_path.clone();
    let output_path = request.output_path.clone();
    let options = request.options.clone();

    let result = spawn_blocking(move || {
        // Open source image
        let img = match ImageReader::open(&source_path) {
            Ok(reader) => reader.with_guessed_format()
                .map_err(|e| format!("Failed to open image: {}", e))?
                .decode()
                .map_err(|e| format!("Failed to decode image: {}", e))?,
            Err(e) => return Err(format!("Failed to open image file: {}", e)),
        };

        // Resize if needed
        let target_width = options.target_width.max(1);
        let target_height = options.target_height.max(1);
        
        let processed_img = if img.width() != target_width || img.height() != target_height {
            img.resize_exact(
                target_width,
                target_height,
                image::imageops::FilterType::Lanczos3,
            )
        } else {
            img
        };

        // Create output directory if needed
        if let Some(parent) = Path::new(&output_path).parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create output directory: {}", e))?;
        }

        // Save with format
        let output_format = get_output_format(&options.target_format);
        
        match output_format {
            ImageFormat::Jpeg => {
                // Convert to RGB if necessary (JPEG doesn't support alpha)
                let rgb_img = processed_img.to_rgb8();
                let mut output_file = std::fs::File::create(&output_path)
                    .map_err(|e| format!("Failed to create output file: {}", e))?;
                let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut output_file, options.quality.max(1).min(100) as u8);
                encoder.encode(&rgb_img, target_width, target_height, image::ExtendedColorType::Rgb8)
                    .map_err(|e| format!("Failed to encode JPEG: {}", e))?;
            }
            ImageFormat::Ico => {
                // For ICO, save as PNG first (ICO format is complex)
                let png_path = output_path.replace(".ico", ".png");
                processed_img.save_with_format(&png_path, ImageFormat::Png)
                    .map_err(|e| format!("Failed to save ICO: {}", e))?;
            }
            _ => {
                processed_img.save_with_format(&output_path, output_format)
                    .map_err(|e| format!("Failed to save image: {}", e))?;
            }
        }

        let (width, height) = processed_img.dimensions();

        Ok::<ConversionResult, String>(ConversionResult {
            success: true,
            output_path: Some(output_path),
            width: Some(width),
            height: Some(height),
            error: None,
        })
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(result)
}

/// Batch convert multiple images
#[command]
pub async fn batch_convert(request: BatchConversionRequest) -> Result<BatchConversionResult, String> {
    // Create output directory first
    std::fs::create_dir_all(&request.output_directory)
        .map_err(|e| format!("Failed to create output directory: {}", e))?;

    let mut results = Vec::new();
    let mut successful = 0;
    let mut failed = 0;

    // Process each source image
    for source_path in &request.source_paths {
        // Process each size
        for (width, height) in &request.sizes {
            // Process each format
            for format in &request.target_formats {
                let size_str = format!("{}x{}", width, height);

                // Sanitize source filename to prevent path traversal
                let source_name = Path::new(source_path)
                    .file_stem()
                    .unwrap_or_default()
                    .to_str()
                    .unwrap_or("image");
                let sanitized_name = sanitize_filename(source_name);

                // Generate output filename based on pattern
                let file_ext = if format == "ico" { "png" } else { format };
                let file_name = request.naming_pattern
                    .replace("{name}", &sanitized_name)
                    .replace("{size}", &size_str)
                    .replace("{format}", &sanitize_filename(format))
                    .replace("{width}", &width.to_string())
                    .replace("{height}", &height.to_string());
                
                let final_filename = if file_name.contains('.') {
                    file_name
                } else {
                    format!("{}.{}", file_name, file_ext)
                };

                // Build output path based on organization
                let output_path = match request.organization.as_str() {
                    "by-size" => format!("{}/{}/{}", request.output_directory, size_str, final_filename),
                    "by-format" => format!("{}/{}/{}", request.output_directory, format, final_filename),
                    "by-size-and-format" => format!("{}/{}/{}/{}", request.output_directory, size_str, format, final_filename),
                    _ => format!("{}/{}", request.output_directory, final_filename),
                };

                // Validate output path doesn't escape output directory
                let output_path_obj = Path::new(&output_path);
                let output_dir_obj = Path::new(&request.output_directory);
                if !is_path_safe(output_dir_obj, output_path_obj) {
                    failed += 1;
                    results.push(ConversionResult {
                        success: false,
                        output_path: None,
                        width: None,
                        height: None,
                        error: Some("Invalid output path".to_string()),
                    });
                    continue;
                }

                let convert_request = ConversionRequest {
                    source_path: source_path.clone(),
                    output_path: output_path.clone(),
                    options: ConversionOptions {
                        target_format: format.clone(),
                        target_width: *width,
                        target_height: *height,
                        quality: request.quality,
                        maintain_aspect_ratio: true,
                        background_color: None,
                    },
                };

                match convert_image(convert_request).await {
                    Ok(result) => {
                        if result.success {
                            successful += 1;
                        } else {
                            failed += 1;
                        }
                        results.push(result);
                    }
                    Err(e) => {
                        failed += 1;
                        results.push(ConversionResult {
                            success: false,
                            output_path: None,
                            width: None,
                            height: None,
                            error: Some(e),
                        });
                    }
                }
            }
        }
    }

    Ok(BatchConversionResult {
        total: results.len(),
        successful,
        failed,
        results,
    })
}
