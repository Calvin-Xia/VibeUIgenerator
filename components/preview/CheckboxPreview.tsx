'use client';

import { useState } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getCheckboxStyles } from '@/lib/generator';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

export function CheckboxPreview() {
  const tokens = useVibeStore(state => state.tokens);
  const version = useVibeStore(state => state.ui.version);
  const styles = getCheckboxStyles(tokens);

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div key={version} className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Checkbox</div>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <motion.div
              style={checked1 ? styles.checked : styles.unchecked}
              onClick={() => setChecked1(!checked1)}
              whileTap={{ scale: 0.95 }}
            >
              {checked1 && <Check style={styles.indicator} />}
            </motion.div>
            <span>Unchecked</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <motion.div
              style={checked2 ? styles.checked : styles.unchecked}
              onClick={() => setChecked2(!checked2)}
              whileTap={{ scale: 0.95 }}
            >
              {checked2 && <Check style={styles.indicator} />}
            </motion.div>
            <span>Checked</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">States</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div style={styles.disabled}>
              <Check style={styles.indicator} />
            </div>
            <span className="opacity-50">Disabled (Checked)</span>
          </div>
          <div className="flex items-center gap-3">
            <div style={styles.disabled}>
            </div>
            <span className="opacity-50">Disabled (Unchecked)</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Indeterminate</div>
        <div className="flex items-center gap-3">
          <div style={styles.checked}>
            <Minus style={styles.indicator} />
          </div>
          <span>Indeterminate</span>
        </div>
      </div>
    </div>
  );
}
