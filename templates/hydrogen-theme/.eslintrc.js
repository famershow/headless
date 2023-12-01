/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  extends: [
    '@remix-run/eslint-config',
    // 'plugin:hydrogen/recommended', // => has conflicts with prettier v3
    'plugin:hydrogen/typescript',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'hydrogen/prefer-image-component': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'no-case-declarations': 'off',
  },
};
