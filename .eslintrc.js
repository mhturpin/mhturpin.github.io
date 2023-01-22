module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'lines-between-class-members': 'off',
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    'object-shorthand': 'off',
    'prefer-destructuring': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 'off',
  },
};
