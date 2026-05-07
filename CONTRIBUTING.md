# Contributing to GreenRoots Organics

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Be respectful, inclusive, and professional. We're committed to providing a welcoming environment for all contributors.

## How to Contribute

### 1. Report Bugs

- Check existing issues first (don't create duplicates)
- Provide clear, descriptive title
- Include steps to reproduce
- Specify environment (OS, Node version, etc.)
- Attach screenshots/logs if applicable

### 2. Suggest Features

- Check if feature already exists
- Clearly describe the use case
- Explain why this feature would be valuable
- Provide examples if possible

### 3. Submit Code Changes

#### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/your-username/organic-app.git
cd organic-app

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm run install-all

# Create .env files
cp server/.env.example server/.env.development
cp client/.env.example client/.env.development

# Start development
npm run dev
```

#### Coding Standards

- Follow existing code style (ESLint rules)
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

#### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:server
npm run test:client

# Check coverage
npm run test:coverage
```

#### Before Submitting PR

```bash
# Ensure code quality
npm run lint

# Fix formatting issues
npm run lint:fix

# Run full test suite
npm run test:ci

# Build for production
npm run build --workspace client
```

### 4. Submit Pull Request

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing Done
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for clarity
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Documentation updated
```

#### PR Requirements

- ✅ Must pass all CI/CD checks
- ✅ Must include tests
- ✅ Must update documentation if needed
- ✅ Must follow code style
- ✅ No hardcoded secrets or credentials
- ✅ Clear commit history (squash if needed)

## Development Workflow

### Branch Naming Convention

```
feature/feature-name       # New features
bugfix/bug-description     # Bug fixes
hotfix/critical-issue      # Critical production fixes
docs/documentation-update  # Documentation changes
test/test-improvements     # Testing improvements
```

### Commit Message Convention

```
[type] Brief description

Detailed explanation if needed

Fixes #issue-number
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Testing Guidelines

- Write tests for new features
- Write tests for bug fixes
- Maintain >50% code coverage
- Test error cases
- Mock external dependencies

Example test structure:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Test
  });

  it('should handle errors', () => {
    // Error handling test
  });
});
```

## Project Structure

- `client/` - React frontend
- `server/` - Node.js backend
- `.github/workflows/` - CI/CD pipelines
- `docs/` - Documentation

## Development Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Jest Testing](https://jestjs.io)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)

## Getting Help

- Check [README](./README.md) for setup
- See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for env config
- Read [TESTING.md](./TESTING.md) for testing guide
- Open an issue for questions

## Recognized Contributors

All contributors will be recognized in our contributor list!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to GreenRoots Organics! 🌿
