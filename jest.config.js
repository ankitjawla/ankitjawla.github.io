module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['js/**/*.js', '!js/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { branches: 80, functions: 75, lines: 80, statements: 80 },
  },
};
