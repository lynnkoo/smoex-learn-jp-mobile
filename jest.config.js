const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  globals: {
    _window: {},
    __DEV__: true,
    'ts-jest': {
      babelConfig: true,
      tsConfig: {
        importHelpers: true,
      },
      diagnostics: false,
    },
  },
  setupFiles: ['<rootDir>/__mocks__/@ctrip/crn/crn.js'],
  moduleNameMapper: {
  },
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testMatch: ['<rootDir>/src/**/*.test.(js|ts|tsx)'],
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
  ],
  cacheDirectory: '.jest/cache',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text-summary', 'html'],
};
