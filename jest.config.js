module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['js/**/*.js', '!js/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { branches: 90, functions: 100, lines: 100, statements: 100 },
  },
};
