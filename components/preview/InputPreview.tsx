'use client';

import { useVibeStore } from '@/lib/store/vibeStore';
import { getInputStyles } from '@/lib/generator';
import { motion } from 'framer-motion';

export function InputPreview() {
  const tokens = useVibeStore(state => state.tokens);
  const version = useVibeStore(state => state.ui.version);
  const styles = getInputStyles(tokens);

  return (
    <div key={version} className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Default</div>
        <motion.input
          type="text"
          placeholder="Enter text..."
          style={styles}
          whileFocus={{ scale: 1.01 }}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">With Value</div>
        <motion.input
          type="text"
          defaultValue="Hello World"
          style={styles}
          whileFocus={{ scale: 1.01 }}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Disabled</div>
        <input
          type="text"
          placeholder="Disabled input"
          style={{ ...styles, opacity: 0.5, cursor: 'not-allowed' }}
          disabled
          className="w-full"
        />
      </div>
    </div>
  );
}
