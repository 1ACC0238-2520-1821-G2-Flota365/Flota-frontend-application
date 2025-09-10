module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Desactivar la regla de nombres de componentes multi-palabra
    'vue/multi-word-component-names': 'off',
    // Permitir variables no utilizadas si comienzan con _ 
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
  }
}