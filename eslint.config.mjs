import tseslint from 'typescript-eslint';
import hooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: ['.next/', 'node_modules/', 'out/', '.output/', 'functions/']
  },
  {
    plugins: {
      'react-hooks': hooksPlugin
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);
