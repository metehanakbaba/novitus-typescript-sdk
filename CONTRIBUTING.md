# Contributing to Novitus SDK

Thank you for your interest in contributing to the Novitus SDK! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd typescript-sdk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Watch for changes**
   ```bash
   npm run watch
   ```

## Project Structure

```
typescript-sdk/
├── src/
│   ├── client/          # Main client implementation
│   ├── types/           # TypeScript type definitions
│   ├── errors/          # Custom error classes
│   ├── validators/      # Validation logic
│   └── index.ts         # Main entry point
├── examples/            # Usage examples
├── dist/                # Compiled output (gitignored)
└── ...config files
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values
- Document public APIs with JSDoc comments
- Avoid `any` type unless absolutely necessary

### Code Style

- Follow the existing code style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Run `npm run format` before committing

### Linting

- Run `npm run lint` to check for issues
- Fix all linting errors before submitting

## Testing

Before submitting a pull request:

1. Test your changes with the examples
2. Ensure the build succeeds: `npm run build`
3. Check for TypeScript errors
4. Verify linting passes: `npm run lint`

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for new payment method
fix: correct validation for invoice dates
docs: update README with new examples
refactor: improve error handling
```

Prefix conventions:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, maintainable code
   - Add/update documentation
   - Add examples if applicable

4. **Test thoroughly**
   - Test with real Novitus API server if possible
   - Verify all examples still work

5. **Submit pull request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure CI passes (when available)

## Adding New Features

When adding new features:

1. **Update types** in `src/types/`
2. **Add validation** in `src/validators/` if needed
3. **Implement in client** in `src/client/`
4. **Update exports** in `src/index.ts`
5. **Add examples** in `examples/`
6. **Update README** with usage instructions
7. **Update CHANGELOG** with your changes

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Create examples for new features
- Update CHANGELOG.md

## Questions?

Feel free to open an issue for:
- Questions about the codebase
- Feature suggestions
- Bug reports
- General discussion

Thank you for contributing! 🎉


