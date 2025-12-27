import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next/', 'node_modules/', 'out/', '.output/']
  },
  ...next({ root: true }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
);
