'use client';

import { useState, useMemo } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateHTMLSnippets,
  generateReactComponent,
  generateVueComponent,
  generateJSONTokens,
  generateFigmaTokens,
  generateStyleDictionary,
  generateStyledComponents,
  generateEmotion
} from '@/lib/generator/export';
import { CodeBlock } from './CodeBlock';
import { CodeTabs } from './CodeTabs';
import { ExportButtons } from './ExportButtons';

type OutputTab = 'css' | 'tailwind' | 'html' | 'react' | 'vue' | 'json' | 'figma' | 'styleDictionary' | 'styledComponents' | 'emotion';


export function OutputPanel() {
  const tokens = useVibeStore(state => state.tokens);
  const selectedComponent = useVibeStore(state => state.ui.selectedComponent);
  const [activeTab, setActiveTab] = useState<OutputTab>('css');

  const componentType = selectedComponent;

  const cssData = useMemo(() => generateCSSVariables(tokens), [tokens]);
  const tailwindData = useMemo(() => generateTailwindConfig(tokens), [tokens]);
  const htmlData = useMemo(() => generateHTMLSnippets(tokens, componentType), [tokens, componentType]);
  const reactData = useMemo(() => generateReactComponent(tokens, componentType), [tokens, componentType]);
  const vueData = useMemo(() => generateVueComponent(tokens, componentType), [tokens, componentType]);
  const jsonData = useMemo(() => generateJSONTokens(tokens), [tokens]);
  const figmaData = useMemo(() => generateFigmaTokens(tokens), [tokens]);
  const styleDictionaryData = useMemo(() => generateStyleDictionary(tokens), [tokens]);
  const styledComponentsData = useMemo(() => generateStyledComponents(tokens), [tokens]);
  const emotionData = useMemo(() => generateEmotion(tokens), [tokens]);

  const getCode = () => {
    switch (activeTab) {
      case 'css': return cssData.code;
      case 'tailwind': return tailwindData.code;
      case 'html': return htmlData.code;
      case 'react': return reactData.code;
      case 'vue': return vueData.code;
      case 'json': return jsonData.code;
      case 'figma': return figmaData.code;
      case 'styleDictionary': return styleDictionaryData.code;
      case 'styledComponents': return styledComponentsData.code;
      case 'emotion': return emotionData.code;
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
      case 'figma': return 'json';
      case 'styleDictionary': return 'json';
      case 'styledComponents': return 'typescript';
      case 'emotion': return 'typescript';
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
      case 'figma': return figmaData.filename;
      case 'styleDictionary': return styleDictionaryData.filename;
      case 'styledComponents': return styledComponentsData.filename;
      case 'emotion': return emotionData.filename;
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
