# 🎨 Component Showcase - Visual Guide

## 🎯 New Components Overview

All components are located in these directories:
- `components/gamification/` - Game mechanics
- `components/charts/` - Data visualizations
- `components/ui/` - Base UI elements

---

## 1. 📊 XP Bar Component

**File:** `components/gamification/xp-bar.tsx`

### Features:
- Animated progress bar that fills from 0 to current %
- Gradient fill (primary → purple → amber)
- Sparkle shine effect that moves across the bar
- Shows current XP / needed XP
- Displays current level and % to next level
- Smooth animations using Framer Motion

### Usage:
```tsx
import { XPBar } from '@/components/gamification/xp-bar';

<XPBar currentXP={2450} showLabel={true} animated={true} />
```

### Props:
- `currentXP: number` - Current XP amount
- `showLabel?: boolean` - Show level and XP text (default: true)
- `animated?: boolean` - Animate on mount (default: true)

### Visual:
```
Level 6                             2,450 / 4,900 XP
[████████████░░░░░░░░░░░░░░░░░░] 50% to Level 7
```

---

## 2. 🎯 Quest Card Component

**File:** `components/gamification/quest-card.tsx`

### Features:
- Shows quest title, description, and progress
- Animated progress bar
- Completion checkbox (animated)
- Trophy icon on completion
- Shows XP and coin rewards
- Border changes color when completed
- Smooth entrance animation

### Usage:
```tsx
import { QuestCard } from '@/components/gamification/quest-card';

<QuestCard quest={questData} index={0} />
```

### Props:
- `quest: DailyQuest` - Quest data object
- `index: number` - For staggered animation delay

### Visual States:
**In Progress:**
```
○ Issue Explorer
  Browse 5 open issues
  [███████░░] 3 / 5 (60%)
  🏆 50 XP  💰 25 Coins
```

**Completed:**
```
✓ Issue Explorer (strikethrough)
  Browse 5 open issues
  🏆 Trophy icon
```

---

## 3. 🔥 Streak Display Component

**File:** `components/gamification/streak-display.tsx`

### Features:
- Large animated fire emoji
- Shows day count
- Displays bonus multiplier if active
- Pulsing background animation
- Wiggle animation on hover
- Click to trigger confetti celebration

### Usage:
```tsx
import { StreakDisplay } from '@/components/gamification/streak-display';

<StreakDisplay 
  streak={12} 
  onClick={() => console.log('Clicked!')} 
/>
```

### Props:
- `streak: number` - Number of consecutive days
- `onClick?: () => void` - Callback when clicked

### Visual:
```
┌─────────────────────────┐
│   🔥    12 Days         │
│   +25% XP Bonus! 🎉     │
└─────────────────────────┘
```

### Streak Emojis:
- 1-6 days: ✨
- 7-29 days: 🔥
- 30-49 days: 🔥🔥
- 50-99 days: 🔥🔥🔥
- 100+ days: 🔥💯

---

## 4. 🏆 Achievement Showcase Component

**File:** `components/gamification/achievement-showcase.tsx`

### Features:
- Grid layout (2 cols mobile, 4 cols desktop)
- Locked achievements are blurred with lock icon
- Unlocked achievements show full icon
- Progress bars for incomplete achievements
- Rarity-based color schemes
- Click to view detailed modal
- Wiggle animation on unlocked achievements
- Scale animation on hover

### Usage:
```tsx
import { AchievementShowcase } from '@/components/gamification/achievement-showcase';

<AchievementShowcase achievements={achievementArray} />
```

### Props:
- `achievements: Achievement[]` - Array of achievements

### Rarity Colors:
- **Common** (gray): `border-gray-400`
- **Rare** (blue): `border-blue-400`
- **Epic** (purple): `border-purple-400`
- **Legendary** (gold): `border-amber-400`

### Visual:
```
Achievements           3 / 8 unlocked

[🎯]    [⭐]    [🔥]    [🔒🎯]
First   Star    Week    Issue
Steps   Collect Warrior Hunter
COMMON  RARE    EPIC    ███░░░
                        34/50
```

---

## 5. 📡 Live Feed Component

**File:** `components/gamification/live-feed.tsx`

### Features:
- Shows recent user activities
- Auto-generates new activities every 8-15 seconds
- 5 activity types with unique icons and colors
- Avatar display using DiceBear
- Relative timestamps (e.g., "2m ago")
- Shows XP gained (if applicable)
- Slide-in animation for new items
- Scrollable list

### Usage:
```tsx
import { LiveFeed } from '@/components/gamification/live-feed';

<LiveFeed 
  initialActivities={activityArray} 
  maxItems={5} 
/>
```

### Props:
- `initialActivities: LiveActivity[]` - Starting activities
- `maxItems?: number` - Max items to display (default: 5)

### Activity Types:
- 🔵 **Opened PR** - GitPullRequest icon (blue)
- 🟢 **Closed Issue** - CheckCircle icon (green)
- 🟣 **Forked Repo** - GitFork icon (purple)
- 🟡 **Starred Repo** - Star icon (amber)
- 🟠 **Completed Quest** - Trophy icon (orange)

### Visual:
```
🟢 Live Activity           5 recent

[👤] sarah_codes  ✓  closed an issue in
     awesome-toolkit
     +75 XP                    2m ago

[👤] dev_mike  🌟  starred
     next-components           5m ago
```

---

## 6. 📈 Animated Stat Component

**File:** `components/gamification/animated-stat.tsx`

### Features:
- Number counts up from 0 to value
- Icon in top-right corner
- Animated underline
- Glow effect on hover
- Scale animation on entrance
- Spring-based animation for smooth counting

### Usage:
```tsx
import { AnimatedStat } from '@/components/gamification/animated-stat';
import { Zap } from 'lucide-react';

<AnimatedStat
  label="Total XP"
  value={2450}
  icon={Zap}
  color="text-amber-400"
  delay={100}
/>
```

### Props:
- `label: string` - Stat name
- `value: number` - Numeric value
- `icon: LucideIcon` - Icon component
- `color?: string` - Text color class (default: 'text-primary')
- `prefix?: string` - Prefix like "$"
- `suffix?: string` - Suffix like "pts"
- `delay?: number` - Animation delay in ms

### Visual:
```
┌─────────────────────┐
│ TOTAL XP        ⚡  │
│                     │
│   2,450             │
│ ═══════════════     │
└─────────────────────┘
```

---

## 7. 📅 Contribution Heatmap Component

**File:** `components/charts/contribution-heatmap.tsx`

### Features:
- GitHub-style contribution calendar
- 5 intensity levels (gray to dark green)
- Shows last 12 weeks (84 days)
- Hover to see exact count
- Scale animation on hover
- Sequential cell pop-in animation

### Usage:
```tsx
import { ContributionHeatmap } from '@/components/charts/contribution-heatmap';

const data = Array.from({ length: 84 }, (_, i) => ({
  day: 'Jan 1',
  count: Math.floor(Math.random() * 8),
}));

<ContributionHeatmap contributions={data} />
```

### Props:
- `contributions: { day: string; count: number }[]`

### Visual:
```
Contribution Calendar

□ □ □ ■ ■ ■ □ ...
□ ■ ■ □ □ ■ ■ ...
■ □ □ □ ■ ■ □ ...
□ ■ □ ■ □ □ ■ ...
■ ■ ■ □ ■ □ □ ...
□ □ ■ ■ □ ■ ■ ...
■ □ □ □ □ □ ■ ...

Less  □ □ ■ ■ ■  More
```

---

## 8. 🎯 Skill Radar Component

**File:** `components/charts/skill-radar.tsx`

### Features:
- Pentagon/hexagon visualization
- Shows up to 6 skills
- Animated chart rendering
- Polar grid background
- Skill levels from 0-100
- Uses Recharts library

### Usage:
```tsx
import { SkillRadar } from '@/components/charts/skill-radar';

const skills = [
  { name: 'React', value: 85 },
  { name: 'TypeScript', value: 90 },
  { name: 'Node.js', value: 75 },
  // ...
];

<SkillRadar skills={skills} />
```

### Props:
- `skills: { name: string; value: number }[]`

### Visual:
```
   Skill Distribution

         TypeScript(90)
              /\
             /  \
    React  /    \  Node
    (85)  /      \  (75)
         /        \
        /          \
       /    ●●●     \
      /______________\
   Python(80)   Go(70)
```

---

## 9. 🎉 Confetti Trigger Component

**File:** `components/gamification/confetti-trigger.tsx`

### Features:
- Multiple confetti patterns
- Continuous or single-burst modes
- Customizable duration and intensity
- Three pre-built effects

### Usage:
```tsx
import { 
  ConfettiTrigger, 
  fireConfetti, 
  levelUpConfetti 
} from '@/components/gamification/confetti-trigger';

// Component (continuous)
<ConfettiTrigger 
  trigger={showConfetti} 
  onComplete={() => setShowConfetti(false)} 
/>

// Function (single burst)
<button onClick={fireConfetti}>Click me!</button>

// Function (epic celebration)
<button onClick={levelUpConfetti}>Level Up!</button>
```

### Effects:
1. **fireConfetti()** - Single burst from bottom
2. **levelUpConfetti()** - Multi-stage celebration
3. **ConfettiTrigger** - Continuous confetti for duration

---

## 🎨 Styling Patterns

### Consistent Animation Timings:
```tsx
transition={{ duration: 0.3, delay: index * 0.1 }}
```

### Hover Effects:
```tsx
whileHover={{ scale: 1.05, y: -5 }}
```

### Click Feedback:
```tsx
whileTap={{ scale: 0.95 }}
```

### Entrance Animations:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### Staggered Delays:
```tsx
delay: index * 0.05  // 50ms between each item
```

---

## 🎯 Color Palette

### Game Elements:
- **XP/Rewards**: `text-amber-400` / `bg-amber-500`
- **Achievements**: `text-purple-400` / `bg-purple-500`
- **Success/Contributions**: `text-green-400` / `bg-green-500`
- **Info/Activities**: `text-blue-400` / `bg-blue-500`
- **Quests**: `text-primary` (black)

### Gradients:
```css
bg-gradient-to-r from-primary via-purple-500 to-amber-400
bg-gradient-to-br from-primary/5 via-purple-500/5 to-amber-500/5
```

---

## 💡 Pro Tips

### Performance:
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Memoize heavy components with `React.memo`

### Accessibility:
- All buttons have keyboard support
- Hover states are clear
- Focus states are visible
- Animations respect `prefers-reduced-motion`

### Responsiveness:
- All components work on mobile
- Touch-friendly sizes (min 44x44px)
- Horizontal scroll for large content
- Stacked layouts on small screens

---

## 📦 Component Combinations

### Epic Dashboard Section:
```tsx
<XPBar currentXP={2450} />
<div className="grid grid-cols-4 gap-4">
  <AnimatedStat label="XP" value={2450} icon={Zap} />
  <AnimatedStat label="Contributions" value={34} icon={Target} />
  {/* ... */}
</div>
<StreakDisplay streak={12} onClick={levelUpConfetti} />
<LiveFeed initialActivities={activities} />
<QuestCard quest={quest1} index={0} />
<QuestCard quest={quest2} index={1} />
<AchievementShowcase achievements={achievements} />
```

This creates the full gamification experience! 🎮✨
