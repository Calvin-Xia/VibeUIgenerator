'use client';

import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContrastInfo {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaaLarge: boolean;
}

interface AccessibilityHintProps {
  contrast: ContrastInfo;
}

export function AccessibilityHint({ contrast }: AccessibilityHintProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm">
        <span className="font-medium">Contrast Ratio: </span>
        <span className="font-mono">{contrast.ratio}:1</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {contrast.aa ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm">
            AA Normal text: {contrast.aa ? 'Pass' : 'Fail'} (need 4.5:1)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {contrast.aaaLarge ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm">
            AA Large text: {contrast.aaaLarge ? 'Pass' : 'Fail'} (need 3:1)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {contrast.aaa ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Info className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">
            AAA Normal text: {contrast.aaa ? 'Pass' : 'Fail'} (need 7:1)
          </span>
        </div>
      </div>

      <div className="rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium mb-1">WCAG 2.1 Guidelines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Normal text: Minimum 4.5:1 (AA), 7:1 (AAA)</li>
          <li>Large text (18pt+): Minimum 3:1 (AA), 4.5:1 (AAA)</li>
          <li>UI components: Minimum 3:1</li>
        </ul>
      </div>
    </div>
  );
}
