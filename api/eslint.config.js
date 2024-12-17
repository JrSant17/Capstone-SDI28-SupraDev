const js = require('@eslint/js');
const globals = require('globals');
const knexPlugin = require('eslint-plugin-knex');

module.exports = [
  { ignores: ['dist'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
    },
    plugins: {
      knex: knexPlugin,
    },
    rules: {
      ...js.configs.recommended.rules
    }
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];