'use client';

import { useState, useMemo } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateHTMLSnippets,
  generateReactComponent,
  generateVueComponent,
  generateJSONTokens
} from '@/lib/generator/export';
import { CodeBlock } from './CodeBlock';
import { CodeTabs } from './CodeTabs';
import { ExportButtons } from './ExportButtons';
import { cn } from '@/lib/utils';

type OutputTab = 'css' | 'tailwind' | 'html' | 'react' | 'vue' | 'json';

const tabLabels: Record<OutputTab, string> = {
  css: 'CSS',
  tailwind: 'Tailwind',
  html: 'HTML',
  react: 'React',
  vue: 'Vue',
  json: 'JSON'
};

export function OutputPanel() {
  const tokens = useVibeStore(state => state.tokens);
  const selectedComponent = useVibeStore(state => state.ui.selectedComponent);
  const [activeTab, setActiveTab] = useState<OutputTab>('css');

  const cssData = useMemo(() => generateCSSVariables(tokens), [tokens]);
  const tailwindData = useMemo(() => generateTailwindConfig(tokens), [tokens]);
  const htmlData = useMemo(() => generateHTMLSnippets(tokens, selectedComponent), [tokens, selectedComponent]);
  const reactData = useMemo(() => generateReactComponent(tokens, selectedComponent), [tokens, selectedComponent]);
  const vueData = useMemo(() => generateVueComponent(tokens, selectedComponent), [tokens, selectedComponent]);
  const jsonData = useMemo(() => generateJSONTokens(tokens), [tokens]);

  const getCode = () => {
    switch (activeTab) {
      case 'css': return cssData.code;
      case 'tailwind': return tailwindData.code;
      case 'html': return htmlData.code;
      case 'react': return reactData.code;
      case 'vue': return vueData.code;
      case 'json': return jsonData.code;
      default: return cssData.code;
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'css': return 'css';
      case 'tailwind': return 'javascript';
      case 'html': return 'html';
      case 'react': return 'typescript';
      case 'vue': return 'vue';
      case 'json': return 'json';
      default: return 'css';
    }
  };

  const getFilename = () => {
    switch (activeTab) {
      case 'css': return cssData.filename;
      case 'tailwind': return tailwindData.filename;
      case 'html': return htmlData.filename;
      case 'react': return reactData.filename;
      case 'vue': return vueData.filename;
      case 'json': return jsonData.filename;
      default: return cssData.filename;
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-background/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <CodeTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <ExportButtons activeTab={activeTab} />
      </div>

      <div className="flex flex-1 overflow-auto bg-muted/30 p-4">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground capitalize">
              {activeTab.toUpperCase()} - {selectedComponent}
            </h3>
            <span className="text-xs text-muted-foreground">
              {getFilename()}
            </span>
          </div>
          <CodeBlock
            code={getCode()}
            language={getLanguage()}
            filename={getFilename()}
          />
        </div>
      </div>
    </div>
  );
}
