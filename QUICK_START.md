# RepoScout - Quick Start Guide 🚀

## Get Started in 30 Seconds

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

That's it! No authentication, no database setup, no configuration needed.

---

## What to Test

### 🎮 Gamification Dashboard
**URL**: `http://localhost:3000/dashboard`

Features to check:
- Animated XP progress bar (level 6, 2450/3000 XP)
- Daily quests with progress tracking
- Achievement showcase with 8 unlocked achievements
- 12-day streak counter with fire effect
- Live activity feed (auto-generates every 10s)
- Leaderboard showing your rank (#6)
- Contribution heatmap (GitHub-style)
- Skill radar chart
- Animated stat cards

Try clicking on achievements for confetti effects!

---

### 📊 Analytics Dashboard
**URL**: `http://localhost:3000/dashboard/analytics`

Features to check:
- Level progress (Level 3, 385 XP)
- Contribution stats:
  - 8 repositories forked
  - 15 issues closed
  - 12 PRs merged
  - 7-day streak
- 12-week contribution heatmap
- Badge collection (3 badges earned)
- Recent activity feed (5 contributions)

All charts are interactive - hover over elements!

---

### 💫 Swipe Discovery
**URL**: `http://localhost:3000/discover`

Features to check:
- Three-panel layout (filters | cards | match info)
- Swipeable card stack (3 cards visible)
- Drag gestures with rotation effect
- Four action buttons:
  - ← Skip (red)
  - 💾 Save (blue)
  - 👁️ View Project
  - → Interested (green)
- Keyboard shortcuts (←→SE keys)
- Match score breakdown (70-100%)
- Language and difficulty filters
- Search functionality

Try swiping left/right or using arrow keys!

---

### 🔍 Explore Repositories
**URL**: `http://localhost:3000/explore`

Features to check:
- 10 mock repositories
- Language filter (TypeScript, JavaScript, Python, etc.)
- Search by name/description
- Min stars filter
- Good First Issues toggle
- Active repos toggle
- Sort by: stars, updated, forks, best-match
- Repository cards with:
  - Star count
  - Fork count
  - Open issues
  - Language badge
  - Topics
  - Last updated time

---

### 🐛 Issue Browser
**URL**: `http://localhost:3000/issues`

Features to check:
- 12 mock issues across different repos
- Search by keywords
- Language filter
- Repository filter (owner/repo)
- Label filters:
  - Good First Issue
  - Help Wanted
  - Documentation
- Sort by: updated, created, comments
- Match score (if authenticated)
- Issue cards showing:
  - Title and body
  - Labels
  - Comment count
  - Repository info
  - Created/updated time

---

### 🌟 Good First Issues
**URL**: `http://localhost:3000/good-first-issues`

Pre-filtered to show only beginner-friendly issues!

---

### ⚙️ Settings
**URL**: `http://localhost:3000/settings`

View demo user profile:
- Username: demo-dev
- Email: demo@reposcout.dev
- Skills: TypeScript, React, Next.js, Node.js, Python
- Interests: Web Development, Open Source, UI/UX, DevOps

---

## Build for Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

Build output:
- ✅ 23 routes compiled
- ✅ Static pages generated
- ✅ JavaScript bundles optimized
- ✅ Zero errors

---

## Key Features

### 🎯 No Authentication Required
- All pages work instantly
- Demo user pre-loaded
- No sign-in barriers
- Real feel with mock data

### 🎮 Gaming Mechanics
- XP and leveling system
- Daily quests
- Achievement unlocks
- Streak tracking
- Leaderboards
- Confetti celebrations

### 🎨 Modern Design
- Dark theme (#09090B background)
- Professional typography
- Smooth animations (Framer Motion)
- Responsive layout
- Lucide icons (no emojis)
- Glass morphism effects

### 📊 Rich Visualizations
- Contribution heatmap
- Skill radar chart
- Animated progress bars
- Live activity feed
- Interactive charts

### 🔥 Swipe Discovery
- Tinder-style mechanics
- Drag gestures
- Match scoring
- Advanced filters
- Keyboard shortcuts

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts, Victory
- **Icons**: Lucide React
- **Effects**: Canvas Confetti
- **State**: React Hooks

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code

# Database (not needed for demo)
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Cache Issues
```bash
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

### Build Errors
```bash
# Clean install
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

---

## What Makes This Special

### 🎯 Portfolio Ready
- Professional design
- No placeholder content
- Real-looking data
- Smooth interactions

### 🎮 Addictive UX
- Gaming mechanics
- Progress tracking
- Achievement unlocks
- Streak system

### ⚡ Performance
- Fast page loads
- Optimized bundles
- Lazy loading
- Image optimization

### 🎨 Modern Stack
- Latest Next.js 14
- TypeScript strict mode
- Tailwind CSS
- Framer Motion

---

## Next Steps

1. **Explore All Pages**: Click through every link
2. **Test Interactions**: Try swipes, filters, searches
3. **Check Mobile**: Responsive design works everywhere
4. **Watch Animations**: Smooth 60fps everywhere
5. **View Source**: Clean, maintainable code

---

## Questions?

- Check `DEMO_MODE_FIXES.md` for technical details
- Check `DISCOVERY_SUMMARY.md` for discovery page docs
- Check `DISCOVERY_QUICKSTART.md` for swipe mechanics

**Enjoy exploring RepoScout! 🚀**
