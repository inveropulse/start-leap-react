# Contributing Guide

Thank you for your interest in contributing to the Enterprise React Starter! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix issues in existing functionality
- **Feature enhancements** - Improve existing features
- **New features** - Add new capabilities to the starter
- **Documentation** - Improve or add documentation
- **Performance improvements** - Optimize existing code
- **Testing** - Add or improve test coverage

### Before You Start

1. **Check existing issues** - Look for existing issues or discussions
2. **Create an issue** - For significant changes, create an issue first
3. **Discuss the approach** - Get feedback before implementing large changes

## 🚀 Getting Started

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd enterprise-react-starter
   ```

2. **Run the setup script:**
   ```bash
   chmod +x tools/scripts/setup.sh
   ./tools/scripts/setup.sh
   ```

3. **Start development:**
   ```bash
   pnpm dev
   ```

### Project Structure

Familiarize yourself with the monorepo structure:

```
enterprise-react-starter/
├── apps/web/              # Main React application
├── packages/
│   ├── config/           # Shared configurations
│   ├── ui/               # UI component library
│   └── utils/            # Shared utilities
├── tools/scripts/        # Development tools
└── docs/                 # Documentation
```

## 📝 Development Workflow

### 1. Branch Naming

Use descriptive branch names:

```bash
# Features
git checkout -b feature/add-authentication
git checkout -b feature/improve-logging

# Bug fixes
git checkout -b fix/button-styling-issue
git checkout -b fix/memory-leak-in-hook

# Documentation
git checkout -b docs/update-deployment-guide
git checkout -b docs/add-contributing-guide

# Refactoring
git checkout -b refactor/simplify-error-handling
git checkout -b refactor/improve-build-performance
```

### 2. Making Changes

#### Code Style Guidelines

- **TypeScript**: Use strict TypeScript with proper type annotations
- **Component Structure**: Follow the established patterns
- **Naming Conventions**: Use descriptive, consistent names
- **Comments**: Add JSDoc comments for public APIs

#### Example Component Structure

```tsx
import React from 'react';
import { logger } from '@company/utils';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  /**
   * The title to display
   */
  title: string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * MyComponent provides functionality for...
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  className,
  onClick,
}) => {
  const handleClick = () => {
    logger.info('MyComponent clicked', {
      component: 'MyComponent',
      title
    });
    onClick?.();
  };

  return (
    <div 
      className={cn('base-styles', className)}
      onClick={handleClick}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export default MyComponent;
```

#### Design System Guidelines

Always use design tokens instead of hardcoded values:

```tsx
// ❌ Don't do this
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">

// ✅ Do this
<div className="bg-enterprise-primary text-primary-foreground p-4 rounded-lg shadow-enterprise">
```

#### Logging Guidelines

Use the centralized logger for all logging:

```tsx
import { logger } from '@company/utils';

// Set context at component level
logger.setContext({
  component: 'MyComponent',
  feature: 'authentication'
});

// Log events with structured data
logger.info('User action performed', {
  action: 'login_attempt',
  userId: user.id,
  timestamp: Date.now()
});

// Log errors with context
logger.error('API request failed', error, {
  endpoint: '/api/users',
  method: 'POST',
  statusCode: response.status
});
```

### 3. Quality Checks

Before committing, ensure your code passes all quality checks:

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Build check
pnpm build
```

### 4. Testing

#### Unit Tests

Write unit tests for new functionality:

```tsx
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with the provided title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Integration Tests

Test component interactions:

```tsx
// Integration test example
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('App Integration', () => {
  it('renders the main page correctly', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Enterprise React Starter')).toBeInTheDocument();
  });
});
```

## 📋 Commit Guidelines

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

#### Examples

```bash
# New feature
git commit -m "feat(ui): add enterprise button variant with gradient styling"

# Bug fix
git commit -m "fix(logger): resolve memory leak in external service integration"

# Documentation
git commit -m "docs(contributing): add detailed testing guidelines"

# Performance improvement
git commit -m "perf(build): optimize bundle size by implementing dynamic imports"

# Breaking change
git commit -m "feat(config)!: restructure configuration API for better flexibility

BREAKING CHANGE: The configuration API has been restructured. See migration guide."
```

## 🔍 Code Review Process

### Submitting a Pull Request

1. **Create a descriptive title:**
   ```
   feat(ui): add dark mode toggle with system preference detection
   ```

2. **Write a detailed description:**
   ```markdown
   ## Changes
   - Added dark mode toggle component
   - Implemented system preference detection
   - Updated design tokens for dark theme
   - Added tests for theme switching logic
   
   ## Testing
   - [ ] Tested in light mode
   - [ ] Tested in dark mode
   - [ ] Tested system preference changes
   - [ ] Verified accessibility
   
   ## Screenshots
   [Include relevant screenshots]
   ```

3. **Link related issues:**
   ```markdown
   Closes #123
   Related to #456
   ```

### Review Checklist

#### For Reviewers

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Code Quality**: Is the code clean, readable, and maintainable?
- [ ] **Performance**: Are there any performance implications?
- [ ] **Security**: Are there any security concerns?
- [ ] **Testing**: Are there adequate tests?
- [ ] **Documentation**: Is documentation updated if needed?
- [ ] **Design System**: Are design tokens used correctly?
- [ ] **TypeScript**: Are types properly defined?
- [ ] **Accessibility**: Are accessibility standards met?

#### For Contributors

- [ ] **Quality Checks**: All linting and type checks pass
- [ ] **Tests**: New functionality is tested
- [ ] **Documentation**: Updated relevant documentation
- [ ] **Design System**: Used semantic tokens and variants
- [ ] **Performance**: Considered performance implications
- [ ] **Breaking Changes**: Documented any breaking changes

## 🐛 Bug Reports

### Creating Bug Reports

When creating bug reports, include:

1. **Clear title**: Describe the issue briefly
2. **Steps to reproduce**: Detailed reproduction steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Browser, OS, Node version, etc.
6. **Screenshots**: If applicable
7. **Console logs**: Any relevant error messages

#### Bug Report Template

```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96.0]
- Node version: [e.g. 18.17.0]
- pnpm version: [e.g. 9.12.0]

## Additional Context
Add any other context about the problem here.
```

## 💡 Feature Requests

### Creating Feature Requests

When requesting features, include:

1. **Problem statement**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Alternatives**: What alternatives have you considered?
4. **Use cases**: Who would benefit from this feature?
5. **Implementation ideas**: Any thoughts on implementation?

#### Feature Request Template

```markdown
## Problem Statement
A clear description of what the problem is.

## Proposed Solution
A clear description of what you want to happen.

## Alternatives Considered
A clear description of any alternative solutions you've considered.

## Use Cases
Who would benefit from this feature and how?

## Additional Context
Add any other context or screenshots about the feature request here.
```

## 📚 Documentation Contributions

### Types of Documentation

- **API Documentation**: Generated from TypeScript interfaces
- **Guides**: Step-by-step instructions
- **Examples**: Code examples and use cases
- **Architecture**: High-level system documentation

### Documentation Standards

- **Clear and concise**: Use simple, direct language
- **Code examples**: Include working code examples
- **Up-to-date**: Keep documentation current with code changes
- **Searchable**: Use clear headings and structure

## 🎉 Recognition

### Contributors

We recognize contributors in several ways:

- **GitHub**: Listed in the contributors section
- **Changelog**: Mentioned in release notes
- **Documentation**: Contributors page in docs

### Types of Recognition

- **Code contributions**: Features, fixes, improvements
- **Documentation**: Guides, examples, API docs
- **Community support**: Helping other users
- **Testing**: Finding bugs, testing features
- **Design**: UI/UX improvements

## ❓ Getting Help

### Resources

- **Documentation**: Check the docs/ directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server

### Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: For real-time community support

---

Thank you for contributing to the Enterprise React Starter! Your contributions help make this project better for everyone. 🚀