# Contributing to RepoScout

Thank you for your interest in contributing to RepoScout! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or later
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/RepoScout.git
   cd RepoScout
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔧 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes
- Write clean, maintainable code
- Follow existing code style
- Add comments for complex logic
- Update types as needed

### 3. Test Your Changes
```bash
# Run tests
npm run test

# Run linter
npm run lint

# Build to verify
npm run build
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add amazing new feature"
```

Commit message conventions:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Submit!

---

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  );
};

// Bad
export const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### File Organization
```
components/
├── feature-name/
│   ├── component-name.tsx      # Component logic
│   └── types.ts                # Component types
```

### Styling
- Use Tailwind CSS utility classes
- Follow existing color scheme
- Maintain responsive design
- Use semantic HTML

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- path/to/test.spec.ts
```

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest';
import { calculateXP } from '@/lib/gamification/calculations';

describe('calculateXP', () => {
  it('should calculate correct XP for contributions', () => {
    const xp = calculateXP({ type: 'PR_MERGED' });
    expect(xp).toBe(75);
  });
});
```

---

## 🎯 What Can You Contribute?

### Good First Issues
Look for issues labeled `good first issue` - these are great for newcomers!

### Feature Ideas
- New gamification mechanics
- Additional chart visualizations
- UI/UX improvements
- Performance optimizations
- Accessibility enhancements

### Bug Fixes
- Report bugs with detailed steps to reproduce
- Fix existing bugs from issue tracker
- Improve error handling

### Documentation
- Improve README
- Add code comments
- Create tutorials
- Fix typos

---

## 🚫 What NOT to Contribute

- Breaking changes without discussion
- Features that don't align with project goals
- Code that significantly increases bundle size
- Changes that break existing functionality
- Untested code

---

## 💬 Communication

### Questions?
- Open a GitHub Discussion
- Comment on relevant issues
- Ask in pull request comments

### Reporting Bugs
1. Check if bug already reported
2. Create detailed issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features
1. Check if feature already requested
2. Create issue with:
   - Clear description
   - Use cases
   - Potential implementation
   - Mockups if applicable

---

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are documented
- [ ] Commit messages are clear
- [ ] PR description explains changes
- [ ] No console.log statements left
- [ ] TypeScript types are proper
- [ ] Responsive design maintained

---

## 📋 PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated
```

---

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in README

---

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Unprofessional conduct

---

## 📧 Contact

Questions? Reach out:
- GitHub Issues: For bugs and features
- GitHub Discussions: For questions and ideas

---

Thank you for contributing to RepoScout! 🚀
