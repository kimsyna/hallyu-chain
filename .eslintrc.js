module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    mocha: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    gsap: 'readonly',
    ScrollTrigger: 'readonly',
  },
  rules: {},
};
