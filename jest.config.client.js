module.exports = {
  displayName: 'client',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/client/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js', '**/?(*.)+(spec|test).jsx'],
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/client/src/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    '!client/src/**/*.test.{js,jsx}',
    '!client/src/index.js',
    '!client/src/serviceWorkerRegistration.js',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};
