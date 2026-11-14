import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'src/routeTree.gen.ts', 'src/paraglide']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // names are 2+ characters; only the loop index `i` may be shorter
      'id-length': [
        'error',
        { min: 2, exceptions: ['i'], properties: 'never' },
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      // async event handlers in JSX are fine; React ignores the returned promise
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      // TanStack Router's beforeLoad throws redirect() by design
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'Redirect',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      // event handlers are named functions declared before the JSX, not written inline in it
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > :matches(ArrowFunctionExpression, FunctionExpression)',
          message:
            'Declare the handler as a named function before the return (e.g. const handleClick = …) and pass it by name.',
        },
        {
          // {books.map((book) => <li>…</li>)} → {books.map(renderBook)}, or an item component when it's big
          selector:
            'JSXExpressionContainer CallExpression[callee.property.name=/^(map|flatMap|filter|sort|find|some|every|reduce)$/] > :matches(ArrowFunctionExpression, FunctionExpression)',
          message:
            'Name the list callback before the return (const renderItem = …, or const options = list.map(…)); a big item gets its own component.',
        },
      ],
    },
  },
  {
    // components and functions name their numbers; styles and tests may write them as they are
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.css.ts', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          // 2 halves and centres (width / 2)
          ignore: [0, 1, -1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
    },
  },
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      // same blank-line rule as lexum-orchestrator
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'function',
            'class',
            'multiline-block-like',
            'multiline-const',
            'multiline-let',
            'multiline-expression',
          ],
        },
        {
          blankLine: 'always',
          prev: [
            'function',
            'class',
            'multiline-block-like',
            'multiline-const',
            'multiline-let',
            'multiline-expression',
          ],
          next: '*',
        },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        {
          blankLine: 'any',
          prev: ['singleline-const', 'singleline-let'],
          next: ['singleline-const', 'singleline-let'],
        },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
]);
