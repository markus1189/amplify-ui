module.exports = {
  extends: ['@aws-amplify/amplify-ui/react'],
  // TODO remove StorageManager from ignorePatterns when types are fixed
  ignorePatterns: [
    '.eslintrc.js',
    'dist',
    'rollup.config.ts',
    '**/StorageManager/**',
  ],
  // point to local tsconfig
  parserOptions: { project: ['tsconfig.json'], tsconfigRootDir: __dirname },
  overrides: [
    {
      extends: ['@aws-amplify/amplify-ui/jest'],
      files: ['**/__mocks__/**', '**/__tests__/**'],
    },
  ],
};
