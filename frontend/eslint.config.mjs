import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['bundle.js'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
      },
    },
  },
];
