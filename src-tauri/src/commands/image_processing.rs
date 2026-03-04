use serde::{Deserialize, Serialize};
use tauri::command;
use image::{GenericImageView, ImageFormat, ImageReader};
use std::path::{Path, Component};
use std::fs;
use tokio::task::spawn_blocking;

/// Sanitize filename to prevent path traversal
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

/// Validate path safety
fn is_path_safe(output_dir: &Path, full_path: &Path) -> bool {
    match full_path.strip_prefix(output_dir) {
        Ok(relative) => !relative.components().any(|c| c == Component::ParentDir),
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

fn get_format_from_ext(ext: &str) -> Option<ImageFormat> {
    match ext.to_lowercase().as_str() {
        "png" => Some(ImageFormat::Png),
        "jpg" | "jpeg" => Some(ImageFormat::Jpeg),
        "webp" => Some(ImageFormat::WebP),
        "bmp" => Some(ImageFormat::Bmp),
        "gif" => Some(ImageFormat::Gif),
        "tiff" | "tif" => Some(ImageFormat::Tiff),
        _ => None,
    }
}

fn supports_transparency(format: ImageFormat) -> bool {
    matches!(format, ImageFormat::Png | ImageFormat::WebP | ImageFormat::Gif)
}

/// Get image metadata
#[command]
pub async fn get_image_metadata(path: String) -> Result<ImageMetadata, String> {
    println!("Getting metadata for: {}", path);
    
    let path_clone = path.clone();
    
    let metadata = spawn_blocking(move || {
        // Check if file exists
        if !Path::new(&path_clone).exists() {
            return Err(format!("File does not exist: {}", path_clone));
        }
        
        // Try to open image
        let img = ImageReader::open(&path_clone)
            .map_err(|e| format!("Failed to open image {}: {}", path_clone, e))?
            .decode()
            .map_err(|e| format!("Failed to decode image {}: {}", path_clone, e))?;
        
        let (width, height) = img.dimensions();
        
        let file_metadata = fs::metadata(&path_clone)
            .map_err(|e| format!("Failed to get file metadata: {}", e))?;
        
        let ext = Path::new(&path_clone)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("unknown");
        
        let format = get_format_from_ext(ext)
            .map(|f| format!("{:?}", f))
            .unwrap_or_else(|| "unknown".to_string());
        
        let has_transparency = get_format_from_ext(ext)
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
    .map_err(|e| format!("Task failed: {}", e))?;

    metadata
}

/// Convert single image
#[command]
pub async fn convert_image(request: ConversionRequest) -> Result<ConversionResult, String> {
    println!("Converting: {} -> {}", request.source_path, request.output_path);
    
    let source_path = request.source_path.clone();
    let output_path = request.output_path.clone();
    let options = request.options.clone();

    let result = spawn_blocking(move || {
        // Verify source exists
        if !Path::new(&source_path).exists() {
            return Err(format!("Source file does not exist: {}", source_path));
        }
        
        // Create output directory
        if let Some(parent) = Path::new(&output_path).parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create directory {}: {}", parent.display(), e))?;
        }
        
        // Open and decode image
        let img = ImageReader::open(&source_path)
            .map_err(|e| format!("Failed to open {}: {}", source_path, e))?
            .decode()
            .map_err(|e| format!("Failed to decode {}: {}", source_path, e))?;
        
        println!("Opened image: {}x{}", img.width(), img.height());
        
        // Resize
        let target_width = options.target_width.max(1);
        let target_height = options.target_height.max(1);
        
        let processed = if img.width() != target_width || img.height() != target_height {
            img.resize_exact(target_width, target_height, image::imageops::FilterType::Lanczos3)
        } else {
            img
        };
        
        // Determine output format
        let ext = Path::new(&output_path)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("png");
        
        let format = get_format_from_ext(ext).unwrap_or(ImageFormat::Png);
        
        println!("Saving to: {} as {:?}", output_path, format);
        
        // Save based on format
        match format {
            ImageFormat::Jpeg => {
                // JPEG needs RGB8
                let rgb = processed.to_rgb8();
                let mut file = fs::File::create(&output_path)
                    .map_err(|e| format!("Failed to create file {}: {}", output_path, e))?;
                
                let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(
                    &mut file, 
                    options.quality.clamp(1, 100)
                );
                encoder.encode(
                    &rgb, 
                    target_width, 
                    target_height, 
                    image::ExtendedColorType::Rgb8
                ).map_err(|e| format!("Failed to encode JPEG: {}", e))?;
            }
            ImageFormat::Png => {
                processed.save_with_format(&output_path, ImageFormat::Png)
                    .map_err(|e| format!("Failed to save PNG: {}", e))?;
            }
            ImageFormat::WebP => {
                processed.save_with_format(&output_path, ImageFormat::WebP)
                    .map_err(|e| format!("Failed to save WebP: {}", e))?;
            }
            ImageFormat::Bmp => {
                processed.save_with_format(&output_path, ImageFormat::Bmp)
                    .map_err(|e| format!("Failed to save BMP: {}", e))?;
            }
            ImageFormat::Gif => {
                processed.save_with_format(&output_path, ImageFormat::Gif)
                    .map_err(|e| format!("Failed to save GIF: {}", e))?;
            }
            ImageFormat::Tiff => {
                processed.save_with_format(&output_path, ImageFormat::Tiff)
                    .map_err(|e| format!("Failed to save TIFF: {}", e))?;
            }
            _ => {
                // Fallback to PNG
                let png_path = output_path.rsplitn(2, '.').collect::<Vec<_>>();
                let fixed_path = if png_path.len() > 1 {
                    format!("{}.png", png_path[1])
                } else {
                    format!("{}.png", output_path)
                };
                processed.save_with_format(&fixed_path, ImageFormat::Png)
                    .map_err(|e| format!("Failed to save: {}", e))?;
            }
        }
        
        println!("Successfully saved: {}", output_path);
        
        Ok::<ConversionResult, String>(ConversionResult {
            success: true,
            output_path: Some(output_path),
            width: Some(target_width),
            height: Some(target_height),
            error: None,
        })
    })
    .await;
    
    match result {
        Ok(Ok(conv_result)) => Ok(conv_result),
        Ok(Err(e)) => Err(e),
        Err(e) => Err(format!("Task panicked: {}", e)),
    }
}

/// Batch convert images
#[command]
pub async fn batch_convert(request: BatchConversionRequest) -> Result<BatchConversionResult, String> {
    println!("Starting batch conversion...");
    println!("Sources: {:?}", request.source_paths);
    println!("Output dir: {}", request.output_directory);
    println!("Formats: {:?}", request.target_formats);
    println!("Sizes: {:?}", request.sizes);
    
    // Create output directory
    fs::create_dir_all(&request.output_directory)
        .map_err(|e| format!("Failed to create output directory: {}", e))?;
    
    let mut results = Vec::new();
    let mut successful = 0;
    let mut failed = 0;
    
    for source_path in &request.source_paths {
        for (width, height) in &request.sizes {
            for format in &request.target_formats {
                let size_str = format!("{}x{}", width, height);
                
                // Get source name
                let source_name = Path::new(source_path)
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("image");
                let sanitized = sanitize_filename(source_name);
                
                // Build filename
                let file_name = request.naming_pattern
                    .replace("{name}", &sanitized)
                    .replace("{size}", &size_str)
                    .replace("{format}", format)
                    .replace("{width}", &width.to_string())
                    .replace("{height}", &height.to_string());
                
                // Add extension if not present
                let final_name = if file_name.contains('.') {
                    file_name
                } else {
                    format!("{}.{}", file_name, format)
                };
                
                // Build output path based on organization
                let output_path = match request.organization.as_str() {
                    "by-size" => {
                        let dir = format!("{}/{}", request.output_directory, size_str);
                        fs::create_dir_all(&dir).ok();
                        format!("{}/{}", dir, final_name)
                    }
                    "by-format" => {
                        let dir = format!("{}/{}", request.output_directory, format);
                        fs::create_dir_all(&dir).ok();
                        format!("{}/{}", dir, final_name)
                    }
                    "by-size-and-format" => {
                        let dir = format!("{}/{}/{}", request.output_directory, size_str, format);
                        fs::create_dir_all(&dir).ok();
                        format!("{}/{}", dir, final_name)
                    }
                    _ => format!("{}/{}", request.output_directory, final_name),
                };
                
                // Validate path
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
                
                // Convert
                let conv_request = ConversionRequest {
                    source_path: source_path.clone(),
                    output_path: output_path.clone(),
                    options: ConversionOptions {
                        target_format: format.clone(),
                        target_width: *width,
                        target_height: *height,
                        quality: request.quality,
                    },
                };
                
                match convert_image(conv_request).await {
                    Ok(result) => {
                        if result.success {
                            successful += 1;
                            println!("✓ Converted: {}", output_path);
                        } else {
                            failed += 1;
                            println!("✗ Failed: {}", output_path);
                        }
                        results.push(result);
                    }
                    Err(e) => {
                        failed += 1;
                        println!("✗ Error: {} - {}", output_path, e);
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
    
    println!("Batch complete: {}/{} successful", successful, results.len());
    
    Ok(BatchConversionResult {
        total: results.len(),
        successful,
        failed,
        results,
    })
}
