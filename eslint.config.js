// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import reactPlugin from 'react-plugin-react';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    parserOptions:{
      ecmaFeatures:{
        jsx:true,
      },
    },
    plugin : {
      react: reactPlugin,
    },

  },
  eslint.configs.recommended, // 반드시 마지막에! ESLint 스타일 규칙을 끄고 Prettier에게 맡김
  prettierConfig,
  ...storybook.configs['flat/recommended'],
];
