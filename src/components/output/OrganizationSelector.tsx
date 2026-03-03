import React from 'react';
import { FolderTree, Grid, Layers, Combine } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

interface OrganizationSelectorProps {
  onOrganizationChange?: (organization: OrganizationType) => void;
  className?: string;
}

/**
 * Organization types for output structure
 */
export type OrganizationType = 'flat' | 'by-size' | 'by-format' | 'by-size-and-format';

/**
 * Organization option with metadata
 */
interface OrganizationOption {
  id: OrganizationType;
  name: string;
  description: string;
  icon: React.ReactNode;
  example: string;
}

/**
 * Available organization options
 */
const ORGANIZATION_OPTIONS: OrganizationOption[] = [
  {
    id: 'flat',
    name: 'Flat',
    description: 'All files in one folder',
    icon: <Grid className="h-5 w-5" />,
    example: 'output/\n  ├── icon-16x16.png\n  ├── icon-32x32.png\n  └── icon-512x512.png',
  },
  {
    id: 'by-size',
    name: 'By Size',
    description: 'Organize into size folders',
    icon: <FolderTree className="h-5 w-5" />,
    example:
      'output/\n  ├── 16x16/\n  │   └── icon.png\n  ├── 32x32/\n  │   └── icon.png\n  └── 512x512/\n      └── icon.png',
  },
  {
    id: 'by-format',
    name: 'By Format',
    description: 'Organize into format folders',
    icon: <Layers className="h-5 w-5" />,
    example:
      'output/\n  ├── png/\n  │   └── icon-512x512.png\n  ├── jpg/\n  │   └── icon-512x512.jpg\n  └── webp/\n      └── icon-512x512.webp',
  },
  {
    id: 'by-size-and-format',
    name: 'By Size & Format',
    description: 'Organize by both size and format',
    icon: <Combine className="h-5 w-5" />,
    example:
      'output/\n  ├── 16x16/\n  │   ├── png/\n  │   └── jpg/\n  └── 512x512/\n      ├── png/\n      └── webp/',
  },
];

/**
 * OrganizationSelector component - Choose how to organize output files
 */
export default function OrganizationSelector({
  onOrganizationChange,
  className,
}: OrganizationSelectorProps) {
  const [selectedOrganization, setSelectedOrganization] = React.useState<OrganizationType>('flat');

  /**
   * Handle organization change
   */
  const handleOrganizationChange = (organization: OrganizationType) => {
    setSelectedOrganization(organization);
    onOrganizationChange?.(organization);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label>Folder Organization</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how to organize your output files
          </p>
        </div>

        <div className="grid gap-3">
          {ORGANIZATION_OPTIONS.map((option) => {
            const isSelected = selectedOrganization === option.id;

            return (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected && 'border-primary bg-primary/5'
                )}
              >
                <input
                  type="radio"
                  name="organization"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleOrganizationChange(option.id)}
                  className="mt-1 h-4 w-4"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="font-medium">{option.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                  <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-2 font-mono text-xs">
                    {option.example}
                  </pre>
                </div>
              </label>
            );
          })}
        </div>

        {/* Recommendation */}
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground">
            <strong>Recommendation:</strong> Use <strong>By Size</strong> for icons (easier to find
            specific sizes) or <strong>Flat</strong> for simple projects.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
