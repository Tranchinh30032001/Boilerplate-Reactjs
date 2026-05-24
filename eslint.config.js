import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'warn',
      'no-lonely-if': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-constant-condition': 'off',
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      'no-irregular-whitespace': 'off',
      'space-before-blocks': ['warn', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'semi': ['warn', 'never'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'array-bracket-spacing': ['warn', 'never'],
      'linebreak-style': 'off',
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': ['warn', { before: true, after: true }],
      'comma-dangle': ['warn', 'always-multiline'],
      'comma-spacing': ['warn', { before: false, after: true }],
      'arrow-spacing': ['warn', { before: true, after: true }],
      'no-useless-escape': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
])
