# 🎯 Repository Discovery Experience - Premium Swipe Interface

## Overview

The new `/discover` page provides a **professional, swipe-based repository discovery experience** designed for developers. This is NOT a dating app clone - it's a premium, technical interface that uses swipe mechanics for efficient decision-making.

---

## 🎨 Design Philosophy

### Core Principles:
- ✅ **Professional** - Suitable for developer portfolios
- ✅ **Premium** - High-quality visual design
- ✅ **Technical** - Shows relevant developer metrics
- ✅ **Minimal** - Clean, focused interface
- ✅ **No Emojis** - Uses Lucide icons exclusively
- ✅ **Intentional** - Every interaction has purpose

---

## 📐 Layout Structure

### Desktop (1400px max-width):
```
┌─────────────────────────────────────────────────┐
│  Header: Discover Projects                      │
│  Subtitle + Controls                            │
├───────────┬──────────────────────┬───────────────┤
│           │                      │               │
│  LEFT     │      CENTER          │    RIGHT      │
│  PANEL    │    CARD STACK        │    PANEL      │
│           │                      │               │
│  Filters  │  Interactive Swipe   │  Match Info   │
│  Stats    │  Repository Cards    │  Breakdown    │
│           │                      │               │
│  3 cols   │      6 cols          │    3 cols     │
│           │                      │               │
└───────────┴──────────────────────┴───────────────┘
```

### Mobile:
```
┌──────────────────────┐
│  Header              │
│  Controls            │
├──────────────────────┤
│                      │
│   CARD STACK         │
│   (Full width)       │
│                      │
│   Action Buttons     │
│                      │
└──────────────────────┘
```

---

## 🃏 Card Stack Mechanics

### Visual Stack (3 cards):
```
          BACK CARD (scale: 0.94)
      ┌────────────────────┐
      │                    │
      └────────────────────┘

    SECOND CARD (scale: 0.97)
  ┌──────────────────────────┐
  │                          │
  └──────────────────────────┘

 TOP CARD (scale: 1.0, interactive)
┌────────────────────────────────┐
│                                │
│      Repository Details        │
│                                │
│      Drag Left/Right           │
│                                │
└────────────────────────────────┘
```

### Card Dimensions:
- **Width**: 760px max
- **Height**: 680px fixed
- **Border Radius**: 16px (2xl)
- **Background**: #111318 (dark)
- **Border**: 1px subtle gray

---

## 🎮 Interaction Patterns

### Drag Behavior:
- **Drag Left** → Card rotates -10°, shows "SKIP" in red
- **Drag Right** → Card rotates +10°, shows "INTERESTED" in green
- **Release < 150px** → Card springs back to center
- **Release > 150px** → Card exits (left or right)

### Keyboard Controls:
- **← (Left Arrow)** - Skip repository
- **→ (Right Arrow)** - Mark as interested
- **S** - Save/bookmark repository
- **Enter** - View project details
- **Escape** - Close overlays

### Button Actions:
1. **Skip (X icon)** - Dismiss current repository
2. **Save (Bookmark icon)** - Save for later (toggleable)
3. **View Project (ExternalLink icon)** - Navigate to repo details
4. **Interested (ArrowRight icon)** - Primary action (green)

---

## 📊 Repository Card Content

### Card Structure:
```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  ┌────┐  owner/name        94% Match   │
│  │Icon│  Repository Title               │
│  └────┘                                 │
│                                         │
│  Why this matches you:                  │
│  ✓ TypeScript skill                     │
│  ✓ Beginner-friendly                    │
│  ✓ Popular project                      │
│                                         │
├─────────────────────────────────────────┤
│  CONTENT                                │
│                                         │
│  Description                            │
│  "The React Framework for the Web"     │
│                                         │
│  Technology                             │
│  [TypeScript] [React] [Next.js]        │
│                                         │
│  Repository Health                      │
│  ⭐ 132k Stars    🍴 28k Forks          │
│  ⚠ 1.2k Issues    🕐 Updated 2d ago    │
│                                         │
│  Good ways to contribute                │
│  [Good First Issues] [Bug Fixes]       │
│                                         │
├─────────────────────────────────────────┤
│  ACTIONS                                │
│  [Skip] [Save] [View Project] [✓ Interested] │
└─────────────────────────────────────────┘
```

### Match Score (Top Right):
- **94%** - Large, bold number
- **Match** - Label underneath
- **Color**: Green (text-green-400)

### Match Reasons (Under Header):
- Checkmark icon + short reason
- Maximum 4 reasons displayed
- Examples:
  - "TypeScript skill"
  - "Beginner-friendly"
  - "Popular project"
  - "Recent activity"

---

## 🎯 Match Panel (Right Side)

### Content Hierarchy:
```
┌─────────────────────────┐
│   Your Match            │
│                         │
│        94%              │
│   Excellent Match       │
│                         │
├─────────────────────────┤
│   Match Breakdown       │
│                         │
│  [Icon] Skills          │
│         4 / 5           │
│         ████████░       │
│                         │
│  [Icon] Experience      │
│         Intermediate    │
│                         │
│  [Icon] Interests       │
│         3 / 4           │
│         ██████░░        │
│                         │
│  [Icon] Difficulty      │
│         Beginner-friendly│
│                         │
│  [Icon] Activity        │
│         Highly Active   │
│                         │
├─────────────────────────┤
│  Why you may like this  │
│                         │
│  • TypeScript matches   │
│  • Popular repository   │
│  • Recent activity      │
│  • Good first issues    │
└─────────────────────────┘
```

---

## 🔍 Filter Panel (Left Side)

### Filter Categories:
1. **Stats Display**
   - Total repositories count
   - Clean, centered layout

2. **Language Filter**
   - Badge pills (clickable)
   - Options: TypeScript, JavaScript, Python, Go, Rust, Java
   - Multi-select

3. **Experience Level**
   - Radio-style badges
   - Options: Beginner, Intermediate, Advanced
   - Single-select

4. **Difficulty**
   - Options: Easy, Medium, Hard
   - Single-select

5. **Repository Activity**
   - Options: Highly Active, Active, Moderate
   - Single-select

### Reset Button:
- Only shows when filters are active
- Clears all filters instantly

---

## 🎬 Animation Details

### Card Exit Animation:
```typescript
// Swipe Right (Interested)
{
  x: 400,
  opacity: 0,
  transition: { duration: 0.3 }
}

// Swipe Left (Skip)
{
  x: -400,
  opacity: 0,
  transition: { duration: 0.3 }
}
```

### Card Stack Advancement:
```typescript
// Card 2 → Card 1
{
  y: 0,
  scale: 1.0,
  transition: { duration: 0.4 }
}

// Card 3 → Card 2
{
  y: 12,
  scale: 0.97,
  transition: { duration: 0.4 }
}
```

### Drag Indicators:
- **Left**: Red border + "SKIP" text
- **Right**: Green border + "INTERESTED" text
- **Opacity**: Fades in based on drag distance

---

## 🎨 Visual Design Specs

### Colors:
```css
/* Background */
--bg-page: #09090B;
--bg-card: #111318;

/* Borders */
--border: rgba(255, 255, 255, 0.1);

/* Text */
--text-primary: #FFFFFF;
--text-muted: #6d6d6d;

/* Accents */
--green: #22C55E (success, interested, match)
--red: #EF4444 (skip, danger)
--amber: #F59E0B (warnings, highlights)
--blue: #3B82F6 (info)
--purple: #8B5CF6 (experience)
```

### Typography:
```css
/* Page Title */
font-size: 36px;
font-weight: 700;

/* Repository Name */
font-size: 24px;
font-weight: 700;

/* Match Score */
font-size: 48px;
font-weight: 700;

/* Section Headers */
font-size: 10px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;

/* Body Text */
font-size: 14px;
line-height: 1.5;
```

### Spacing System:
- Base: 4px
- Card padding: 32px (8 × 4px)
- Section gap: 24px (6 × 4px)
- Button height: 56px (14 × 4px)

---

## 📱 Mobile Responsiveness

### Breakpoints:
- **Desktop**: >= 1024px (lg)
- **Tablet**: 768px - 1023px (md)
- **Mobile**: < 768px

### Mobile Adjustments:
- Card width: 90vw (with margins)
- Card height: Auto (min 600px)
- Side panels: Hidden
- Filter button: Shows drawer
- Buttons: Full width stack
- Touch gestures: Primary interaction

---

## 🔄 State Management

### Repository States:
```typescript
{
  savedRepos: Set<number>,      // Bookmarked
  interestedRepos: Set<number>, // Swiped right
  skippedRepos: Set<number>,    // Swiped left (session only)
  currentIndex: number,          // Current card position
}
```

### Filter State:
```typescript
{
  languages: string[],
  experience: string | null,
  difficulty: string | null,
  activity: string | null,
  searchQuery: string,
  sortBy: 'recommended' | 'stars' | 'updated' | 'active'
}
```

---

## 🎯 User Flows

### Primary Flow:
1. User lands on `/discover`
2. Sees top repository card
3. Reads match score and reasons
4. Evaluates repository details
5. Decides action:
   - **Interested** → Swipe right or click button
   - **Skip** → Swipe left or click button
   - **Save** → Click bookmark
   - **Learn More** → Click view project
6. Next card appears
7. Repeat

### Filter Flow:
1. User clicks filter badges
2. Repository list filters instantly
3. Card stack updates
4. Match scores recalculate

### Save Flow:
1. User clicks bookmark icon
2. Icon fills/empties (toggle)
3. Repository saved to profile
4. Card remains visible
5. User continues browsing

### View Project Flow:
1. User clicks "View Project"
2. Navigate to `/projects/[owner]/[repo]`
3. See full repository details
4. Can return to discovery

---

## 🚀 Performance Considerations

### Optimizations:
- ✅ Only 3 cards rendered at once
- ✅ GPU-accelerated animations (transform, opacity)
- ✅ Debounced search input
- ✅ Lazy-loaded components
- ✅ Memoized calculations

### Load Times:
- Initial render: < 500ms
- Card transition: 300ms
- Filter update: Instant

---

## 🎯 Accessibility

### Keyboard Navigation:
- All actions keyboard-accessible
- Visible focus states
- Logical tab order

### Screen Readers:
- Proper ARIA labels
- Semantic HTML structure
- Alt text for icons

### Color Contrast:
- WCAG AA compliant
- Text readable on all backgrounds

---

## 🔧 Technical Stack

### Components:
```
components/discovery/
├── repository-card-stack.tsx  # Main card stack with swipe
├── match-panel.tsx            # Right sidebar match info
└── filter-panel.tsx           # Left sidebar filters
```

### Dependencies:
- **Framer Motion** - Animations and gestures
- **Lucide React** - Icon system
- **Next.js** - Routing and navigation

---

## 📊 Data Requirements

### Repository Object:
```typescript
{
  id: number,
  name: string,
  owner: { login: string, avatarUrl: string },
  description: string,
  stars: number,
  forks: number,
  openIssuesCount: number,
  language: string,
  topics: string[],
  updatedAt: string,
  pushedAt: string,
  hasGoodFirstIssues: boolean,
  isActive: boolean,
}
```

### Match Score Calculation:
- Skills match: 0-35 points
- Experience match: 0-20 points
- Interest match: 0-15 points
- Difficulty match: 0-10 points
- Activity match: 0-10 points
- Technology match: 0-10 points
- **Total**: 0-100 points

---

## 🎉 Key Features

### What Makes This Premium:

1. **Smooth Animations** - 60fps spring physics
2. **Precise Alignment** - Every pixel matters
3. **Consistent Spacing** - 4px grid system
4. **Professional Icons** - No emojis, Lucide only
5. **Dark Theme** - Premium black background
6. **Clear Typography** - Strong hierarchy
7. **Intentional Colors** - Green for success, meaningful accents
8. **Responsive Design** - Works on all devices
9. **Keyboard Support** - Power user friendly
10. **Accessibility** - WCAG compliant

---

## 🚦 Getting Started

### Run the Page:
```bash
npm run dev
```

Visit: `http://localhost:3000/discover`

### Navigate:
The "Discover" link is now in the navbar (first item)

---

## 💡 Future Enhancements

### Potential Additions:
- Real-time GitHub API integration
- Persistent user preferences
- Undo last action
- Smart recommendations based on history
- Share interesting repositories
- Dark/light theme toggle
- Custom filters
- Repository comparison mode
- Batch actions
- Export saved repositories

---

## ✨ Summary

The discovery page transforms repository browsing from a static grid into an **engaging, efficient decision-making interface**. It respects the developer's time by showing one repository at a time with all relevant information, making it easy to quickly evaluate and act.

**This is NOT Tinder for code. This is a premium developer tool that happens to use swipe mechanics because they're efficient for binary decisions.**

The interface is clean, professional, and portfolio-worthy. 🎯
