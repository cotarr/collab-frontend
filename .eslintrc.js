module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Require parenthesis around arrow function argument
    'arrow-parens': 'error',
    'comma-dangle': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 100, tabWidth: 2, ignoreUrls: true }],
    semi: ['error', 'always'],
    'object-shorthand': 'off'

    // 'no-unused-vars': 'off'
  }
};
