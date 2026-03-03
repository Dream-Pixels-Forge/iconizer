import { useState } from 'react';
import { Play } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { useSettingsStore } from '../../stores/settingsStore';
import DirectorySelector from './DirectorySelector';
import NamingConvention from './NamingConvention';
import OrganizationSelector from './OrganizationSelector';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import type { OrganizationType } from './OrganizationSelector';

export default function OutputPanel() {
  const { selectedSizes, selectedFormats } = useConfigStore();
  const { defaultOrganization } = useSettingsStore();

  const [outputPath, setOutputPath] = useState('');
  const [organization, setOrganization] = useState<OrganizationType>(defaultOrganization);
  const [namingPattern, setNamingPattern] = useState('{name}-{size}.{format}');
  const [isConverting, setIsConverting] = useState(false);

  const totalOutputs = selectedSizes.length * selectedFormats.length;

  const handleConvert = async () => {
    if (!outputPath || totalOutputs === 0) return;

    setIsConverting(true);
    // In Tauri, this would invoke the conversion command
    console.log('Starting conversion...', {
      outputPath,
      organization,
      namingPattern,
      sizes: selectedSizes,
      formats: selectedFormats,
    });

    // Simulate conversion
    setTimeout(() => setIsConverting(false), 2000);
  };

  const canConvert = outputPath && totalOutputs > 0 && !isConverting;

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
              <span className="text-muted-foreground">Selected Sizes</span>
              <span>{selectedSizes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Formats</span>
              <span>{selectedFormats.length}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <span>Total Outputs</span>
              <span>{totalOutputs} files</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
