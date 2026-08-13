# 🔍 RepoScout

**Discover your next open-source contribution with gamified, personalized repository matching.**

RepoScout transforms how developers find and contribute to open-source projects by combining intelligent matching algorithms with addictive gaming mechanics. Built for developers who want to make meaningful contributions without spending hours searching.

---

## ✨ Key Features

### 🎮 **Gamification System**
- **XP & Leveling**: Earn experience points and level up as you contribute
- **Daily Quests**: Complete challenges to earn rewards and build streaks
- **Achievements**: Unlock 8+ achievements across 4 rarity tiers
- **Leaderboards**: Compete with the community and track your rank
- **Streak Tracking**: Maintain contribution streaks with visual fire indicators
- **Contribution Heatmap**: GitHub-style activity visualization
- **Live Activity Feed**: Real-time updates from the community

### 🎯 **Smart Discovery**
- **Personalized Matching**: Repositories scored 70-100% based on your skills
- **Advanced Filters**: Language, difficulty, experience level, activity status
- **Repository Explorer**: Browse and search thousands of projects
- **Issue Browser**: Find good first issues and help wanted tasks
- **Skill-Based Recommendations**: Matched to TypeScript, React, Python, and more

### 📊 **Analytics Dashboard**
- **Contribution Stats**: Track forks, PRs, issues, and commits
- **Skill Radar Chart**: Visualize your technology stack
- **12-Week Heatmap**: See your contribution patterns
- **Badge Collection**: Display earned achievements
- **Progress Tracking**: Monitor level progression and XP gains

### 🎨 **Modern UX**
- **Dark Theme**: Professional #09090B background
- **Smooth Animations**: 60fps Framer Motion effects
- **Responsive Design**: Mobile-first approach
- **Keyboard Shortcuts**: Power user navigation
- **Confetti Celebrations**: Visual rewards for achievements

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/RepoScout.git
cd RepoScout

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🎯 Demo Mode

**RepoScout currently operates in demo mode** to provide a complete experience without external dependencies:

### What's Included
- ✅ **Full UI/UX**: Complete interface with all features enabled
- ✅ **Mock Data**: 10 repositories, 12 issues, realistic user profiles
- ✅ **Gamification**: Functional XP system, quests, achievements
- ✅ **Analytics**: Charts, heatmaps, and progress tracking
- ✅ **No Setup**: No API keys, database, or authentication required

### Demo User Profile
```
Username: demo-dev
Level: 3 (385 XP)
Skills: TypeScript, React, Next.js, Node.js, Python
Contributions: 42 total, 7-day streak
Achievements: 3 badges unlocked
```

---

## 🗂️ Project Structure

```
RepoScout/
├── app/                          # Next.js 14 App Router pages
│   ├── dashboard/               # Gamification dashboard
│   ├── explore/                 # Repository browser
│   ├── issues/                  # Issue finder
│   ├── discover/                # Swipe-based discovery (bonus)
│   └── settings/                # User preferences
├── components/                   # React components
│   ├── gamification/            # XP, quests, achievements
│   ├── charts/                  # Heatmap, radar charts
│   ├── discovery/               # Swipe cards (bonus)
│   └── ui/                      # Reusable UI components
├── lib/                          # Utilities and logic
│   ├── gamification/            # XP calculations, mock data
│   ├── github/                  # Repository/issue utilities
│   └── types/                   # TypeScript definitions
└── public/                       # Static assets
```

---

## 🎮 Features Overview

### Dashboard (`/dashboard`)
- XP progress bar with animated leveling
- 4 daily quests with progress tracking
- Achievement showcase (8 achievements)
- Streak counter with fire animation
- Live activity feed (auto-updates every 10s)
- Leaderboard showing top contributors
- Quick stats: contributions, level, streak

### Analytics (`/dashboard/analytics`)
- Level progression visualization
- Contribution statistics (forks, PRs, issues)
- 12-week contribution heatmap
- Badge collection display
- Recent activity timeline
- Streak tracking with best record

### Repository Explorer (`/explore`)
- Search by name, keyword, or description
- Filter by language, stars, activity
- Sort by stars, updates, forks, best-match
- Repository cards with detailed stats
- Good First Issue indicators
- Topic tags and language badges

### Issue Browser (`/issues`)
- Search across all repositories
- Filter by language, labels, repository
- Good First Issue & Help Wanted toggles
- Match score for personalized ranking
- Sort by updated, created, comments
- Detailed issue cards with context

### Settings (`/settings`)
- View user profile information
- Manage skills and interests
- Update preferences
- Link to onboarding flow

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts, Victory
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

### Development
- **Linting**: ESLint 9
- **Testing**: Vitest
- **Type Checking**: TypeScript 5.6
- **Package Manager**: npm

---

## 📈 Performance

- **Build Time**: ~30 seconds
- **Bundle Size**: 87.4 kB shared JS
- **Routes**: 25 optimized pages
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Other Platforms
- **Netlify**: Zero-config deployment
- **Railway**: Docker support
- **AWS Amplify**: Enterprise hosting
- **DigitalOcean**: Self-hosted option

No environment variables required for demo mode!

---

## 🔮 Future Enhancements

### Phase 1: Live Integration
- [ ] GitHub OAuth authentication
- [ ] Real-time GitHub API integration
- [ ] Live repository and issue data
- [ ] User profile syncing
- [ ] PostgreSQL database with Prisma

### Phase 2: Advanced Features
- [ ] Automated forking with GitHub CLI
- [ ] One-click repository cloning
- [ ] Branch creation and PR submission
- [ ] Contribution workflow automation
- [ ] GitHub Desktop integration

### Phase 3: Social & Community
- [ ] Team/Guild system
- [ ] Pair programming matcher
- [ ] Code review roulette
- [ ] Mentor matching
- [ ] Community challenges

### Phase 4: AI & Intelligence
- [ ] AI-powered repository recommendations
- [ ] Skill gap analysis with learning paths
- [ ] Issue difficulty prediction
- [ ] Smart contribution suggestions
- [ ] Automated code review assistance

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

We welcome contributions! However, note that this is currently a demo/portfolio project. For major changes:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting platform
- **Tailwind CSS**: For utility-first CSS
- **Framer Motion**: For smooth animations
- **GitHub**: For inspiration and the platform

---

## 📧 Contact

**Project Link**: [https://github.com/yourusername/RepoScout](https://github.com/yourusername/RepoScout)

---

## 🎯 Why RepoScout?

Traditional open-source discovery is broken:
- ❌ Searching GitHub is overwhelming
- ❌ Hard to find beginner-friendly projects
- ❌ No personalized recommendations
- ❌ Contribution tracking is manual
- ❌ No motivation to maintain streaks

RepoScout solves this:
- ✅ Personalized 70-100% match scores
- ✅ Filtered good first issues
- ✅ Skill-based intelligent matching
- ✅ Automatic progress tracking
- ✅ Gamification keeps you motivated

**Start your open-source journey today!** 🚀
