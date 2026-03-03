# Contributing to Iconizer

Thank you for your interest in contributing to Iconizer! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in your interactions. We welcome contributors of all backgrounds and experience levels.

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - System information

### Suggesting Features

1. Check existing issues first
2. Create a feature request issue with:
   - Problem description
   - Proposed solution
   - Use cases
   - Alternatives considered

### Pull Requests

1. Fork the repository
2. Create a branch from `dev`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Write/update tests
5. Ensure all checks pass:
   ```bash
   pnpm lint
   pnpm test
   pnpm format
   ```
6. Commit with conventional commits:
   ```bash
   git commit -m "feat: add your feature"
   ```
7. Push and create PR:
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

Examples:
```
feat: add drag-and-drop import
fix: resolve transparency issue in WebP conversion
docs: update installation instructions
style: format components with prettier
refactor: extract image validation logic
test: add unit tests for SizeSelector
chore: update dependencies
```

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for setup instructions.

## Code Style

### TypeScript
- Use strict mode
- Prefer interfaces for object types
- Use type guards for runtime checks

### React
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused

### Rust
- Follow Rust style guidelines
- Use `cargo clippy` for linting
- Document public APIs

### CSS/Tailwind
- Use Tailwind utility classes
- Extract repeated patterns to components
- Use CSS variables for theming

## Testing

### Requirements
- All new features need tests
- Maintain >80% code coverage
- Include edge cases

### Running Tests
```bash
# All tests
pnpm test

# With coverage
pnpm test:coverage

# Specific file
pnpm test -- MyComponent.test.tsx
```

## Documentation

- Update docs for user-facing changes
- Add JSDoc comments for public APIs
- Update README for significant changes

## Questions?

- Check existing documentation
- Search discussions
- Ask in Discord

Thank you for contributing! 🎉
