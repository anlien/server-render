module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: '16.9',
    },
  },
  globals: {
    __ISPROD__: 'readonly',
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 2,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    camelcase: 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
    'react/default-props-match-prop-types': 0,
    // indent: ['error', 4],
    'linebreak-style': [0, 'error', 'windows'],
    quotes: ['error', 'single'],
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    // 'react/jsx-uses-react': 2,// 'React' is defined but never used
    'react-hooks/rules-of-hooks': 0, // Checks rules of Hooks
    // '@typescript-eslint/explicit-function-return-type': [
    //     'warn',
    //     { allowExpressions: true },
    // ], // Consider using explicit annotations for object literals and function return types even when they can be inferred.
    'no-empty': 'warn',
  },
};
