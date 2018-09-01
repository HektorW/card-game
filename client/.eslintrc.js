module.exports = {
  parser: 'babel-eslint',

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },

  env: {
    browser: true,
    node: false
  },

  extends: ['../.eslintrc.js', 'plugin:react/recommended'],

  plugins: ['react'],

  globals: {
    process: true
  }
}
