module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/cli.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  moduleNameMapper: {
    '@squoosh/lib': '<rootDir>/test/__mocks__/@squoosh/lib.js'
  }
};
