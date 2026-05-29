'use client';

import { useVibeStore } from '@/lib/store/vibeStore';
import { getBadgeStyles } from '@/lib/generator';
import { motion } from 'framer-motion';

export function BadgePreview() {
  const tokens = useVibeStore(state => state.tokens);
  const version = useVibeStore(state => state.ui.version);
  const styles = getBadgeStyles(tokens);

  return (
    <div key={version} className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Variants</div>
        <div className="flex flex-wrap gap-3">
          <motion.span style={styles.solid} whileHover={{ scale: 1.05 }}>
            Solid
          </motion.span>
          <motion.span style={styles.outline} whileHover={{ scale: 1.05 }}>
            Outline
          </motion.span>
          <motion.span style={styles.soft} whileHover={{ scale: 1.05 }}>
            Soft
          </motion.span>
        </div>
      </div>

        <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Status Badges</div>
        <div className="flex flex-wrap gap-3">
          <motion.span
            style={{ ...styles.solid, backgroundColor: tokens.badge.statusColors?.success ?? '#22c55e' }}
            whileHover={{ scale: 1.05 }}
          >
            Success
          </motion.span>
          <motion.span
            style={{ ...styles.solid, backgroundColor: tokens.badge.statusColors?.error ?? '#ef4444' }}
            whileHover={{ scale: 1.05 }}
          >
            Error
          </motion.span>
          <motion.span
            style={{ ...styles.solid, backgroundColor: tokens.badge.statusColors?.warning ?? '#f59e0b' }}
            whileHover={{ scale: 1.05 }}
          >
            Warning
          </motion.span>
          <motion.span
            style={styles.soft}
            whileHover={{ scale: 1.05 }}
          >
            Info
          </motion.span>
        </div>
      </div>
    </div>
  );
}
