module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'max-len': 'off',
    'new-cap': 'off',
    'quotes': 'off',
    'semi': 'off',
    'object-curly-spacing': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    'no-unused-vars': 'off',
    'arrow-parens': 'off',
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
