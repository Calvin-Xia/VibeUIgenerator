'use client';

import { useVibeStore } from '@/lib/store/vibeStore';
import { getAvatarStyles } from '@/lib/generator';
import { motion } from 'framer-motion';

export function AvatarPreview() {
  const tokens = useVibeStore(state => state.tokens);
  const version = useVibeStore(state => state.ui.version);
  const styles = getAvatarStyles(tokens);

  return (
    <div key={version} className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Fallback Avatars</div>
        <div className="flex items-center gap-4">
          <motion.div
            style={styles.container}
            whileHover={{ scale: 1.05 }}
          >
            <span style={styles.fallback}>JD</span>
          </motion.div>
          <motion.div
            style={styles.container}
            whileHover={{ scale: 1.05 }}
          >
            <span style={styles.fallback}>AB</span>
          </motion.div>
          <motion.div
            style={styles.container}
            whileHover={{ scale: 1.05 }}
          >
            <span style={styles.fallback}>XY</span>
          </motion.div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Different Sizes</div>
        <div className="flex items-center gap-4">
          <motion.div
            style={{ ...styles.container, width: 32, height: 32 }}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{ ...styles.fallback, fontSize: 12 }}>S</span>
          </motion.div>
          <motion.div
            style={styles.container}
            whileHover={{ scale: 1.05 }}
          >
            <span style={styles.fallback}>M</span>
          </motion.div>
          <motion.div
            style={{ ...styles.container, width: 56, height: 56 }}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{ ...styles.fallback, fontSize: 22 }}>L</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
