import { useState, useCallback } from 'react';
import { Play } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useConfigStore } from '../../stores/configStore';
import { useImportStore } from '../../stores/importStore';
import { useSettingsStore } from '../../stores/settingsStore';
import DirectorySelector from './DirectorySelector';
import NamingConvention from './NamingConvention';
import OrganizationSelector from './OrganizationSelector';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import type { OrganizationType } from './OrganizationSelector';

export default function OutputPanel() {
  const { selectedSizes, selectedFormats, quality } = useConfigStore();
  const { images } = useImportStore();
  const { defaultOrganization } = useSettingsStore();

  const [outputPath, setOutputPath] = useState('');
  const [organization, setOrganization] = useState<OrganizationType>(defaultOrganization);
  const [namingPattern, setNamingPattern] = useState('{name}-{size}.{format}');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  const totalOutputs = selectedSizes.length * selectedFormats.length;

  const handleConvert = useCallback(async () => {
    if (!outputPath || totalOutputs === 0 || images.length === 0) return;

    setIsConverting(true);
    setConversionResult(null);

    try {
      // Parse sizes to width/height pairs
      const sizes = selectedSizes.map((sizeStr) => {
        const [width, height] = sizeStr.split('x').map((n) => parseInt(n, 10));
        return [width, height] as [number, number];
      });

      // Prepare batch conversion request
      const result = await invoke<{
        total: number;
        successful: number;
        failed: number;
        results: Array<{ success: boolean; output_path?: string; error?: string }>;
      }>('batch_convert', {
        request: {
          sourcePaths: images.map((img) => img.path),
          outputDirectory: outputPath,
          targetFormats: selectedFormats,
          sizes: sizes,
          quality: quality,
          organization: organization,
          namingPattern: namingPattern,
        },
      });

      setConversionResult({
        total: result.total,
        successful: result.successful,
        failed: result.failed,
      });

      // Open folder after conversion if enabled
      if (result.successful > 0) {
        const settings = useSettingsStore.getState();
        if (settings.openFolderAfterCompletion) {
          try {
            await invoke('open_folder', { path: outputPath });
          } catch (openError) {
            console.error('Failed to open folder:', openError);
          }
        }
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      setConversionResult({
        total: totalOutputs * images.length,
        successful: 0,
        failed: totalOutputs * images.length,
      });
    } finally {
      setIsConverting(false);
    }
  }, [
    outputPath,
    totalOutputs,
    images,
    selectedSizes,
    selectedFormats,
    quality,
    organization,
    namingPattern,
  ]);

  const canConvert = outputPath && totalOutputs > 0 && images.length > 0 && !isConverting;

  return (
    <div className="space-y-4">
      {/* Output Configuration */}
      <DirectorySelector onDirectorySelected={setOutputPath} />

      <OrganizationSelector onOrganizationChange={setOrganization} />

      <NamingConvention onPatternChange={setNamingPattern} />

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 text-sm font-medium">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source Images</span>
              <span>{images.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Sizes</span>
              <span>{selectedSizes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Formats</span>
              <span>{selectedFormats.length}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total Outputs</span>
              <span>{totalOutputs * images.length} files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Result */}
      {conversionResult && (
        <Card>
          <CardContent className="p-4">
            <h4 className="mb-2 text-sm font-medium">Conversion Complete</h4>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">
                  {conversionResult.successful} successful
                </span>
                {conversionResult.failed > 0 && (
                  <span className="ml-2 text-red-600">{conversionResult.failed} failed</span>
                )}
              </div>
              <span className="text-muted-foreground">of {conversionResult.total} total</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convert Button */}
      <Button
        className="h-12 w-full text-base"
        onClick={handleConvert}
        disabled={!canConvert}
        size="lg"
      >
        {isConverting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Converting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Convert Images
          </span>
        )}
      </Button>

      {/* Helper Text */}
      {!outputPath && (
        <p className="text-center text-xs text-muted-foreground">
          Select an output folder to begin
        </p>
      )}

      {totalOutputs === 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Select at least one size and format
        </p>
      )}

      {images.length === 0 && (
        <p className="text-center text-xs text-muted-foreground">Import images to convert</p>
      )}
    </div>
  );
}
