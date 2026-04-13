# Contributing to TASK-alavista

Thank you for your interest in contributing to TASK-alavista! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Obsidian (for testing)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TASK-alavista.git
   cd TASK-alavista
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/MisterEleven/TASK-alavista.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a test vault**
   - Create a new Obsidian vault for testing
   - Create a symbolic link to your development build:
     ```bash
     ln -s /path/to/TASK-alavista /path/to/test-vault/.obsidian/plugins/task-alavista
     ```

6. **Start development**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main`: Stable releases only
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Creating a Feature Branch

```bash
# Update your fork
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Write clean, readable code**
   - Follow the existing code style
   - Use meaningful variable and function names
   - Keep functions small and focused

2. **Add TSDoc comments**
   ```typescript
   /**
    * Parse a scheduled task from a markdown line
    *
    * @param line - The markdown line to parse
    * @param filePath - Path to the file containing the line
    * @param lineNumber - Line number in the file (0-based)
    * @returns Parse result with task or error
    */
   static parseLine(line: string, filePath: string, lineNumber: number): ParseResult {
     // Implementation
   }
   ```

3. **Run linting and formatting**
   ```bash
   # Check for linting errors
   npm run lint

   # Auto-fix formatting
   npm run format

   # Type check
   npx tsc --noEmit
   ```

4. **Test your changes**
   - Test in your Obsidian test vault
   - Verify all features work as expected
   - Test edge cases

### Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit history.

#### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

#### Scope (Optional)

- `parser`: Task parsing logic
- `calendar`: ICS generation
- `ui`: User interface components
- `core`: Core functionality (TaskManager, etc.)
- `settings`: Settings management
- `ci`: CI/CD workflows

#### Examples

```bash
# Feature
git commit -m "feat(parser): add support for recurring events"

# Bug fix
git commit -m "fix(calendar): correct timezone handling in ICS generation"

# Documentation
git commit -m "docs: update installation instructions"

# Refactoring
git commit -m "refactor(core): simplify TaskManager initialization"

# With body
git commit -m "feat(ui): add task filtering by date range

Add date range picker to sidebar for filtering tasks.
Includes start and end date selection with calendar widget."
```

### Submitting a Pull Request

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select `develop` as the base branch
   - Fill out the PR template

3. **PR Title Format**
   ```
   feat(parser): add natural language parsing support
   ```

4. **PR Description Should Include**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)
   - Related issues (if any)

### PR Review Process

1. **Automated Checks**
   - CI must pass (linting, type checking, build)
   - No merge conflicts

2. **Code Review**
   - At least one maintainer approval required
   - Address review comments
   - Push additional commits if needed

3. **Merge**
   - Maintainer will merge when approved
   - Branch will be deleted after merge

## Code Style Guidelines

### TypeScript

- Use strict TypeScript (`strict: true` in tsconfig.json)
- Avoid `any` type; use proper types or `unknown`
- Use interfaces for object shapes
- Use type aliases for unions and complex types

### Naming Conventions

- **Classes**: PascalCase (`TaskParser`, `IcsGenerator`)
- **Interfaces**: PascalCase (`ScheduledTask`, `ParseResult`)
- **Functions/Methods**: camelCase (`parseLine`, `generateIcs`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_SETTINGS`, `VIEW_TYPE_TASK_ALAVISTA`)
- **Private members**: Prefix with underscore (`_internalState`)

### File Organization

```
src/
├── module/
│   ├── types.ts          # Type definitions
│   ├── ModuleName.ts     # Main implementation
│   └── helpers.ts        # Helper functions
```

### Comments

- Use TSDoc for public APIs
- Explain "why" not "what" in inline comments
- Keep comments up-to-date with code changes

### Error Handling

```typescript
try {
  await this.riskyOperation();
} catch (error) {
  console.error("Failed to perform operation:", error);
  throw new Error(
    `Operation failed: ${error instanceof Error ? error.message : "Unknown error"}`
  );
}
```

## Testing

### Manual Testing Checklist

- [ ] Plugin loads without errors
- [ ] Settings persist correctly
- [ ] Tasks parse from various formats
- [ ] ICS file generates correctly
- [ ] Sidebar displays tasks accurately
- [ ] Deep links open correct notes
- [ ] Calendar app subscribes successfully
- [ ] Completed tasks behave as configured

### Edge Cases to Test

- [ ] Empty vault (no tasks)
- [ ] Malformed task syntax
- [ ] Past dates
- [ ] Very long event titles
- [ ] Special characters in file paths
- [ ] Rapid file modifications
- [ ] File deletions and renames

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Adding new settings

### Documentation Files

- `README.md`: User-facing documentation
- `ARCHITECTURE.md`: Technical architecture
- `TASK_FORMAT.md`: Task format specification
- `DEVELOPMENT_PLAN.md`: Development roadmap
- Code comments: TSDoc for all public APIs

## Release Process

Maintainers only:

1. **Update Version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   - Add release notes
   - List all changes since last release

3. **Create Git Tag**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

4. **GitHub Actions**
   - Automatically builds and creates release
   - Attaches `main.js`, `manifest.json`, `styles.css`

## Getting Help

- 💬 [GitHub Discussions](https://github.com/MisterEleven/TASK-alavista/discussions)
- 🐛 [Issue Tracker](https://github.com/MisterEleven/TASK-alavista/issues)
- 📧 Email: [taskalavista@feddern.dev](mailto:taskalavista@feddern.dev)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- README acknowledgments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TASK-alavista! 🎉