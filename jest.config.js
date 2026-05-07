module.exports = {
  projects: [
    '<rootDir>/jest.config.server.js',
    '<rootDir>/jest.config.client.js',
  ],
  collectCoverageFrom: [
    'server/**/*.js',
    'client/src/**/*.{js,jsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/dist/**',
  ],
};
