# Testing Guide

Complete testing setup for the Organic App project.

## Overview

- **Jest**: Test framework for both server and client
- **React Testing Library**: For React component testing
- **Supertest**: For API testing (can be added)
- **Coverage**: Target 50%+ coverage for CI/CD

## Getting Started

### Run All Tests

```bash
# Run all tests (server + client)
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage
```

### Run Specific Test Suite

```bash
# Server tests only
npm run test:server

# Client tests only
npm run test:client

# CI mode (no watch, with coverage)
npm run test:ci

# Generate coverage report
npm run test:coverage
```

## Writing Server Tests

### Basic Setup

Create test file at `server/__tests__/module.test.js`:

```javascript
describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Testing Controllers

```javascript
// server/__tests__/controllers/productController.test.js
const productController = require('../../controllers/productController');

describe('Product Controller', () => {
  it('should fetch all products', async () => {
    const mockReq = {};
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await productController.getProducts(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
  });
});
```

### Testing API Routes

```javascript
// server/__tests__/routes/productRoutes.test.js
// Note: Requires 'supertest' package to be installed
const request = require('supertest');
const app = require('../../server');

describe('Product Routes', () => {
  it('GET /api/products should return products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### Testing Utilities

```javascript
// server/__tests__/utils/tokenUtils.test.js
const tokenUtils = require('../../utils/tokenUtils');

describe('Token Utils', () => {
  it('should generate valid JWT', () => {
    const token = tokenUtils.generateToken({ userId: '123' });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify valid token', () => {
    const token = tokenUtils.generateToken({ userId: '123' });
    const decoded = tokenUtils.verifyToken(token);
    expect(decoded.userId).toBe('123');
  });
});
```

## Writing React Component Tests

### Basic Component Test

```javascript
// client/src/__tests__/components/Button.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<button>Click me</button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', async () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click</button>);

    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing Forms

```javascript
// client/src/__tests__/components/LoginForm.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';

describe('LoginForm', () => {
  it('should submit form with values', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### Testing Redux State

```javascript
// client/src/__tests__/redux/authSlice.test.js
import authReducer, { login, logout } from '../../redux/slices/authSlice';

describe('Auth Reducer', () => {
  const initialState = { user: null, token: null };

  it('should handle login', () => {
    const action = login({ user: { id: '1' }, token: 'abc123' });
    const state = authReducer(initialState, action);

    expect(state.user).toEqual({ id: '1' });
    expect(state.token).toBe('abc123');
  });

  it('should handle logout', () => {
    const state = authReducer(
      { user: { id: '1' }, token: 'abc123' },
      logout()
    );

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
```

### Testing API Calls

```javascript
// client/src/__tests__/utils/api.test.js
import api from '../../utils/api';

jest.mock('axios');
const axios = require('axios');

describe('API Utils', () => {
  it('should fetch products', async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, name: 'Product 1' }],
    });

    const products = await api.get('/products');

    expect(products).toEqual([{ id: 1, name: 'Product 1' }]);
  });
});
```

## Test Coverage

### View Coverage Report

```bash
# Generate coverage
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Targets

- **Lines**: 50%+
- **Functions**: 50%+
- **Branches**: 50%+
- **Statements**: 50%+

These are enforced in CI/CD pipeline.

### Improving Coverage

Focus on critical paths:
1. Auth flows (login, logout, token refresh)
2. Product operations (CRUD)
3. Payment handling
4. Error cases
5. Edge cases

## Common Testing Patterns

### Mocking Dependencies

```javascript
// Mock external module
jest.mock('../external-service', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' })),
}));

// Mock specific function
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  parseData: jest.fn(),
}));
```

### Testing Async Code

```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases

```javascript
it('should handle errors', async () => {
  const error = new Error('API Error');
  jest.mock('./api', () => ({
    fetchData: jest.fn(() => Promise.reject(error)),
  }));

  await expect(functionThatFails()).rejects.toThrow('API Error');
});
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- errorTracker.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- -t "should fetch"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
npm test -- --verbose
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Commits to main/develop branches
- Pre-commit hooks (if configured)

**Test Results**: Check GitHub Actions tab for details

## Best Practices

✅ **DO:**
- Write tests for critical business logic
- Use descriptive test names
- Keep tests isolated and independent
- Mock external dependencies
- Test error cases
- Maintain >50% coverage

❌ **DON'T:**
- Test implementation details (test behavior)
- Create flaky tests that pass/fail randomly
- Skip tests with `.skip()` in commits
- Write tests that depend on execution order
- Test external APIs directly (mock them)

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Example Test Files**: See `server/__tests__/` and `client/src/__tests__/` directories
