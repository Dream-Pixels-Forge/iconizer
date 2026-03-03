import React, { useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface NamingConventionProps {
  onPatternChange?: (pattern: string) => void;
  className?: string;
}

/**
 * Available naming pattern variables
 */
const PATTERN_VARIABLES = [
  { variable: '{name}', description: 'Original file name' },
  { variable: '{size}', description: 'Output size (e.g., 512x512)' },
  { variable: '{format}', description: 'Output format (e.g., png)' },
  { variable: '{width}', description: 'Output width' },
  { variable: '{height}', description: 'Output height' },
  { variable: '{index}', description: 'Sequential number' },
];

/**
 * Default naming patterns
 */
const DEFAULT_PATTERNS = {
  standard: '{name}-{size}.{format}',
  descriptive: '{name}_{width}x{height}.{format}',
  indexed: '{name}_{index}.{format}',
  minimal: '{size}.{format}',
};

/**
 * NamingConvention component - Configure output file naming
 */
export default function NamingConvention({ onPatternChange, className }: NamingConventionProps) {
  const [pattern, setPattern] = useState(DEFAULT_PATTERNS.standard);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate naming pattern
   */
  const validatePattern = useCallback((patternStr: string): boolean => {
    // Check for required format variable
    if (!patternStr.includes('{format}')) {
      setError('Pattern must include {format} variable');
      return false;
    }

    // Check for at least one identifier (name, size, width, height, or index)
    const hasIdentifier =
      patternStr.includes('{name}') ||
      patternStr.includes('{size}') ||
      patternStr.includes('{width}') ||
      patternStr.includes('{height}') ||
      patternStr.includes('{index}');

    if (!hasIdentifier) {
      setError('Pattern must include at least one identifier variable');
      return false;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"|?*]/g;
    if (invalidChars.test(patternStr)) {
      setError('Pattern contains invalid characters (<>:"|?*)');
      return false;
    }

    setError(null);
    return true;
  }, []);

  /**
   * Handle pattern change
   */
  const handlePatternChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPattern = e.target.value;
      setPattern(newPattern);

      if (validatePattern(newPattern)) {
        onPatternChange?.(newPattern);
      }
    },
    [validatePattern, onPatternChange]
  );

  /**
   * Apply a default pattern
   */
  const applyPattern = useCallback(
    (patternKey: keyof typeof DEFAULT_PATTERNS) => {
      const newPattern = DEFAULT_PATTERNS[patternKey];
      setPattern(newPattern);
      validatePattern(newPattern);
      onPatternChange?.(newPattern);
    },
    [validatePattern, onPatternChange]
  );

  /**
   * Generate example output names
   */
  const generateExample = useCallback((): string => {
    return pattern
      .replace('{name}', 'my-icon')
      .replace('{size}', '512x512')
      .replace('{format}', 'png')
      .replace('{width}', '512')
      .replace('{height}', '512')
      .replace('{index}', '001');
  }, [pattern]);

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="naming-pattern">Naming Pattern</Label>

          <Input
            id="naming-pattern"
            type="text"
            value={pattern}
            onChange={handlePatternChange}
            className={cn(
              'font-mono',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="{name}-{size}.{format}"
          />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Quick Pattern Templates */}
        <div className="space-y-2">
          <Label>Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(DEFAULT_PATTERNS).map(([key, _patternStr]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => applyPattern(key as keyof typeof DEFAULT_PATTERNS)}
                className="font-mono text-xs"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Pattern Variables Reference */}
        <div className="space-y-2 border-t pt-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4" />
            <span>Available Variables</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PATTERN_VARIABLES.map((item) => (
              <div
                key={item.variable}
                className="flex items-center gap-2 rounded-md bg-muted/50 p-2"
              >
                <code className="rounded bg-background px-2 py-1 font-mono text-xs">
                  {item.variable}
                </code>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Example Output */}
        <div className="border-t pt-2">
          <Label>Example Output</Label>
          <div className="mt-2 rounded-md bg-muted/50 p-3 font-mono text-sm">
            {generateExample()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
