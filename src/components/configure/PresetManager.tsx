import { useState, useCallback } from 'react';
import { Save, Trash2, Edit2, Check, X } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { QUICK_PRESETS } from '../../lib/presetSizes';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PresetManagerProps {
  onPresetSaved?: (preset: UserPreset) => void;
  onPresetDeleted?: (presetId: string) => void;
  onPresetApplied?: (preset: UserPreset) => void;
}

/**
 * User-defined preset structure
 */
export interface UserPreset {
  id: string;
  name: string;
  description: string;
  sizes: string[];
  isCustom: boolean;
}

/**
 * PresetManager component - Allows users to save, load, and manage custom presets
 */
export default function PresetManager({
  onPresetSaved,
  onPresetDeleted,
  onPresetApplied,
}: PresetManagerProps) {
  const { selectedSizes, applyPreset } = useConfigStore();

  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Load user presets from localStorage
  const [userPresets, setUserPresets] = useState<UserPreset[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconizer-user-presets');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  /**
   * Save current configuration as a new preset
   */
  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) return;

    const newPreset: UserPreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      description: presetDescription.trim() || 'Custom preset',
      sizes: [...selectedSizes],
      isCustom: true,
    };

    const updatedPresets = [...userPresets, newPreset];
    setUserPresets(updatedPresets);

    // Persist to localStorage
    localStorage.setItem('iconizer-user-presets', JSON.stringify(updatedPresets));

    // Reset form
    setPresetName('');
    setPresetDescription('');
    setIsSaving(false);

    // Notify parent
    onPresetSaved?.(newPreset);
  }, [presetName, presetDescription, selectedSizes, userPresets, onPresetSaved]);

  /**
   * Apply a user preset
   */
  const handleApplyPreset = useCallback(
    (preset: UserPreset) => {
      // Apply the sizes from the preset
      applyPreset('all'); // This will be overridden by manual selection

      // Manually set the sizes (in a real implementation, this would be in configStore)
      const event = new CustomEvent('iconizer-apply-preset', { detail: preset });
      window.dispatchEvent(event);

      onPresetApplied?.(preset);
    },
    [applyPreset, onPresetApplied]
  );

  /**
   * Delete a user preset
   */
  const handleDeletePreset = useCallback(
    (presetId: string) => {
      const updatedPresets = userPresets.filter((p) => p.id !== presetId);
      setUserPresets(updatedPresets);
      localStorage.setItem('iconizer-user-presets', JSON.stringify(updatedPresets));
      onPresetDeleted?.(presetId);
    },
    [userPresets, onPresetDeleted]
  );

  /**
   * Start editing a preset
   */
  const handleStartEdit = useCallback((preset: UserPreset) => {
    setEditingId(preset.id);
    setEditName(preset.name);
    setEditDescription(preset.description);
  }, []);

  /**
   * Save edited preset
   */
  const handleSaveEdit = useCallback(() => {
    if (!editName.trim() || !editingId) return;

    const updatedPresets = userPresets.map((preset) => {
      if (preset.id === editingId) {
        return {
          ...preset,
          name: editName.trim(),
          description: editDescription.trim(),
        };
      }
      return preset;
    });

    setUserPresets(updatedPresets);
    localStorage.setItem('iconizer-user-presets', JSON.stringify(updatedPresets));
    setEditingId(null);
  }, [editingId, editName, editDescription, userPresets]);

  /**
   * Cancel editing
   */
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-4">
        {/* Quick Presets Section */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Quick Presets</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(QUICK_PRESETS).map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.id as keyof typeof QUICK_PRESETS)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Save Current Configuration */}
        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Save Current Selection</h3>
            {!isSaving && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaving(true)}
                disabled={selectedSizes.length === 0}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save as Preset
              </Button>
            )}
          </div>

          {isSaving && (
            <div className="space-y-3 rounded-md border bg-muted/50 p-3">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g., My Web Icons"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preset-description">Description (optional)</Label>
                <Input
                  id="preset-description"
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="e.g., Perfect for web projects"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSavePreset} disabled={!presetName.trim()}>
                  <Check className="mr-1 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSaving(false);
                    setPresetName('');
                    setPresetDescription('');
                  }}
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Presets List */}
        {userPresets.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="mb-3 text-sm font-semibold">Your Presets</h3>
            <div className="space-y-2">
              {userPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between rounded-md border bg-card p-3"
                >
                  {editingId === preset.id ? (
                    // Edit Mode
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Preset name"
                        className="h-8"
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        className="h-8"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {preset.sizes.length} sizes
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplyPreset(preset)}
                        >
                          Apply
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(preset)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
