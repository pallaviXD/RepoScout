# RepoScout — Open-Source Discovery & Contribution Workspace

RepoScout helps developers discover open-source repositories and actionable issues matched to their skills, experience level, domain interests, and preferred tech stack.

---

## 📌 Project Overview

This repository contains the **RepoScout Frontend Demonstration & Product Prototype**. It is designed as a standalone Next.js 14 web application demonstrating the complete open-source contribution journey:

1. **Evaluate**: View deterministic match scores (0–100%) broken down by skill, experience, domain interest, and activity velocity.
2. **Explore**: Search open-source projects by language, star threshold, difficulty, and good-first-issue density.
3. **Save**: Bookmark priority repositories and issues into your local workspace.
4. **Contribute**: Follow an interactive 10-step guided roadmap from understanding issues through pull request review.
5. **Track**: Monitor your contribution streaks, XP points, heatmaps, and achievements.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Vitest (`npm run test`)
- **Linting**: ESLint 8 (`npm run lint`)

---

## ⚙️ Demonstration Mode & Deployment Note

> **Note for Judges & Reviewers:**
> RepoScout is currently operating in **Curated Frontend Demonstration Mode**.
> - **No GitHub OAuth / API Keys required**: All data is provided via curated local demo datasets.
> - **Zero Environment Setup**: You do not need to configure `.env` variables or external databases to build, run, or deploy this project.
> - **State Persistence**: User progress, bookmarks, and workflow step completions persist across sessions via `localStorage`.

---

## 🔮 Future Enhancements (Backend & Git Integration)

The production roadmap for RepoScout includes backend services and Git CLI integrations:

1. **GitHub OAuth & NextAuth Authentication**:
   - Secure GitHub sign-in for syncing real contributor profiles and personal scopes.
2. **Live GitHub REST & GraphQL API Integration**:
   - Real-time polling of public repository activity, open PR counts, and live label indexing.
3. **Automated Git CLI Workflow Engine**:
   - One-click repository forking (`gh repo fork`) and local workspace cloning (`git clone`).
   - Automated branch creation (`git checkout -b`) and PR submission (`gh pr create`) straight from the workspace.
4. **Database Persistence**:
   - User profiles, saved bookmarks, and contribution streak history backed by PostgreSQL / Prisma ORM.

---

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/your-username/RepoScout.git
cd RepoScout

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

---

## 🧪 Quality & Verification Commands

```bash
# Run unit test suite (Vitest)
npm run test

# Run ESLint check
npm run lint

# Build production bundle
npx next build
```

---

## 📦 Deployment (Vercel / Netlify)

RepoScout is pre-configured for zero-config deployment on Vercel:

1. Push code to your GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Click **Deploy** (no environment variables required).

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
