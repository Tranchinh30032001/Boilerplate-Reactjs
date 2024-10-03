module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier'
  ],
  rules: {
    'react/no-unescaped-entities': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    '@next/next/no-page-custom-font': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 1,
    'no-lonely-if': 1,
    'no-unused-vars': 1,
    'no-constant-condition':0,
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'no-irregular-whitespace':0,
    'space-before-blocks': ['warn', 'always'],
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2],
    'semi': ['warn', 'never'],
    'quotes': ['warn', 'single'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1,
    'no-useless-escape': 1
  }
}

