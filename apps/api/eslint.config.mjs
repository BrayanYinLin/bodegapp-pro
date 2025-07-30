import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': [
        'error',
        {
          semi: false,
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'no-explicit-any': 'off'
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node }
  },
  tseslint.configs.recommended,
  prettierConfig
])
