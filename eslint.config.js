import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettierConfig, // 반드시 마지막에! ESLint 스타일 규칙을 끄고 Prettier에게 맡김
];
