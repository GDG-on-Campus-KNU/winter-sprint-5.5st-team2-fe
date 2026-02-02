import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  eslint.configs.recommended,
  prettierConfig, // 반드시 마지막에! ESLint 스타일 규칙을 끄고 Prettier에게 맡김
];
