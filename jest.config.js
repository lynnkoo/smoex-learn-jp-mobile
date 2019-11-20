module.exports = {
  preset: 'react-native',
  globals: {
    _window: {},
    __DEV__: true,
  },
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/assetsTransformer.js',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    // '.*\\.(ts)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testMatch: ['**/*.test.(ts|tsx|js)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/pages/(activity|agreements|c2b|comments|gaotieyou|longterm|map|pick|rental_card)/**/*.js',
  ],
  coverageReporters: ['text-summary', 'json-summary', 'lcov', 'html', 'clover'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@ctrip|react-native)'],
};
