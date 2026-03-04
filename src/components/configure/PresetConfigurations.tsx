import { useState, useCallback } from 'react';
import { Save, Download, Trash2, Edit, Check, X } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import type { ImageFormat } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface PresetConfigurationsProps {
  className?: string;
}

/**
 * Custom preset structure
 */
interface CustomPreset {
  id: string;
  name: string;
  description: string;
  sizes: string[];
  formats: ImageFormat[];
  isDefault: boolean;
}

/**
 * Load presets from localStorage
 */
function loadCustomPresets(): CustomPreset[] {
  try {
    const stored = localStorage.getItem('iconizer-custom-presets');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load custom presets:', error);
  }
  return [];
}

/**
 * Save presets to localStorage
 */
function saveCustomPresets(presets: CustomPreset[]): void {
  try {
    localStorage.setItem('iconizer-custom-presets', JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save custom presets:', error);
  }
}

/**
 * PresetConfigurations component - Save and load custom preset configurations
 */
export default function PresetConfigurations({ className }: PresetConfigurationsProps) {
  const { selectedSizes, selectedFormats } = useConfigStore();
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(loadCustomPresets());
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle saving a new preset
   */
  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) {
      setError('Preset name is required');
      return;
    }

    if (selectedSizes.length === 0 && selectedFormats.length === 0) {
      setError('Select at least one size or format');
      return;
    }

    const newPreset: CustomPreset = {
      id: `custom-${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || 'Custom preset',
      sizes: [...selectedSizes],
      formats: [...selectedFormats],
      isDefault: false,
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    saveCustomPresets(updated);

    setPresetName('');
    setPresetDescription('');
    setIsSaving(false);
    setError(null);
  }, [presetName, presetDescription, selectedSizes, selectedFormats, customPresets]);

  /**
   * Handle loading a preset
   */
  const handleLoadPreset = useCallback((preset: CustomPreset) => {
    const currentState = useConfigStore.getState();

    // Apply sizes
    preset.sizes.forEach((sizeId) => {
      if (!currentState.selectedSizes.includes(sizeId)) {
        currentState.toggleSize(sizeId);
      }
    });

    // Apply formats
    preset.formats.forEach((format) => {
      if (!currentState.selectedFormats.includes(format)) {
        currentState.toggleFormat(format);
      }
    });
  }, []);

  /**
   * Handle deleting a preset
   */
  const handleDeletePreset = useCallback(
    (id: string) => {
      const updated = customPresets.filter((p) => p.id !== id);
      setCustomPresets(updated);
      saveCustomPresets(updated);
    },
    [customPresets]
  );

  /**
   * Handle starting edit
   */
  const handleStartEdit = useCallback((preset: CustomPreset) => {
    setEditingId(preset.id);
    setPresetName(preset.name);
    setPresetDescription(preset.description);
  }, []);

  /**
   * Handle canceling edit
   */
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setPresetName('');
    setPresetDescription('');
    setError(null);
  }, []);

  /**
   * Handle saving edited preset
   */
  const handleSaveEdit = useCallback(() => {
    if (!presetName.trim()) {
      setError('Preset name is required');
      return;
    }

    const updated = customPresets.map((p) =>
      p.id === editingId
        ? { ...p, name: presetName.trim(), description: presetDescription.trim() }
        : p
    );

    setCustomPresets(updated);
    saveCustomPresets(updated);
    setEditingId(null);
    setPresetName('');
    setPresetDescription('');
    setError(null);
  }, [editingId, presetName, presetDescription, customPresets]);

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label>Custom Presets</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Save and reuse your favorite configurations
          </p>
        </div>

        {/* Save New Preset */}
        {!isSaving ? (
          <Button variant="outline" size="sm" onClick={() => setIsSaving(true)} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Current Configuration as Preset
          </Button>
        ) : (
          <div className="space-y-2 rounded-md border p-3">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Social Media Icons"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-description">Description (optional)</Label>
              <Input
                id="preset-description"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <Button size="sm" onClick={handleSavePreset} className="flex-1">
                <Check className="mr-2 h-4 w-4" />
                Save Preset
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Saved Custom Presets */}
        {customPresets.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <Label>Saved Presets</Label>
            <div className="grid gap-2">
              {customPresets.map((preset) => (
                <div key={preset.id} className="rounded-md border bg-muted/50 p-3">
                  {editingId === preset.id ? (
                    // Edit Mode
                    <div className="space-y-2">
                      <Input
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        value={presetDescription}
                        onChange={(e) => setPresetDescription(e.target.value)}
                        placeholder="Description"
                        className="text-xs"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit} className="flex-1">
                          <Check className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{preset.name}</h4>
                          <p className="text-xs text-muted-foreground">{preset.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLoadPreset(preset)}
                            className="h-8 w-8"
                            title="Load preset"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(preset)}
                            className="h-8 w-8"
                            title="Edit preset"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePreset(preset.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete preset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {preset.sizes.length} sizes
                        </span>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {preset.formats.length} formats
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground">
            Custom presets are saved locally in your browser and persist across sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
