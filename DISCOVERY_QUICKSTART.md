# 🚀 Discovery Page - Quick Start

## Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000/discover**

---

## 🎮 How to Use

### Method 1: Drag (Desktop)
1. **Click and hold** on the card
2. **Drag left** to skip
3. **Drag right** to mark interested
4. **Release** when you see the indicator

### Method 2: Click Buttons
1. **Skip button** - Dismiss repository
2. **Save button** - Bookmark for later
3. **View Project** - See full details
4. **Interested** - Mark as interested

### Method 3: Keyboard (Fastest!)
- **← (Left Arrow)** - Skip
- **→ (Right Arrow)** - Interested
- **S** - Save/Bookmark
- **Enter** - View Project

---

## 📐 Page Layout

```
┌──────────────────────────────────────────┐
│  Discover Projects                       │
│  Find open-source repos...               │
├──────────┬──────────────────┬────────────┤
│          │                  │            │
│  FILTER  │   CARD STACK     │   MATCH    │
│          │                  │            │
│  12      │   ┌──────────┐   │   94%      │
│ Projects │   │          │   │  Strong    │
│          │   │  REPO    │   │  Match     │
│  TypeS.. │   │  CARD    │   │            │
│  Python  │   │          │   │  Skills    │
│  ...     │   └──────────┘   │  4 / 5     │
│          │                  │            │
│  Reset   │  ← → S Enter     │  Why you   │
│          │                  │  may like  │
└──────────┴──────────────────┴────────────┘
```

---

## 🃏 Card Structure

```
┌─────────────────────────────────────┐
│  [Icon]  owner/name      94% Match  │ ← Header
│          Repository Name             │
│                                      │
│  Why this matches you:               │
│  ✓ TypeScript skill                  │
│  ✓ Beginner-friendly                 │
├─────────────────────────────────────┤
│  Description text...                 │ ← Content
│                                      │
│  Technology:                         │
│  [TypeScript] [React] [Next.js]     │
│                                      │
│  Repository Health:                  │
│  ★ 132k  Fork 28k  ⚠ 1.2k  🕐 2d   │
│                                      │
│  Good ways to contribute:            │
│  [Good First Issues] [Bug Fixes]    │
├─────────────────────────────────────┤
│  [Skip] [Save] [View] [Interested]  │ ← Actions
└─────────────────────────────────────┘
```

---

## 🎨 What The Colors Mean

| Color | Meaning |
|-------|---------|
| **Green** | Success, interested, match score |
| **Red** | Skip, dismiss |
| **White** | Primary text |
| **Gray** | Secondary text |
| **Amber** | Warnings, highlights |
| **Blue** | Information |
| **Purple** | Experience level |

---

## 🎯 The Four Actions

### 1. Skip (X icon)
- **What it does**: Dismisses current repository
- **Keyboard**: ← (Left Arrow)
- **Swipe**: Drag left
- **Result**: Next card appears

### 2. Save (Bookmark icon)
- **What it does**: Bookmarks repository
- **Keyboard**: S
- **Note**: Card stays visible
- **Toggle**: Click again to unsave

### 3. View Project (External Link icon)
- **What it does**: Opens full repository details
- **Keyboard**: Enter
- **Goes to**: `/projects/[owner]/[repo]`

### 4. Interested (Arrow Right icon)
- **What it does**: Marks repository as interested
- **Keyboard**: → (Right Arrow)
- **Swipe**: Drag right
- **Result**: Saved to interests, next card

---

## 🔍 Using Filters

### Left Panel Controls:

**Language** (multi-select)
- Click badges to toggle
- Can select multiple
- Examples: TypeScript, Python, Go

**Experience** (single-select)
- Beginner
- Intermediate
- Advanced

**Difficulty**
- Easy
- Medium
- Hard

**Activity**
- Highly Active (< 24h)
- Active (< 1 week)
- Moderate

**Reset**
- Clears all filters
- Only shows when filters active

---

## 📊 Match Panel (Right Side)

### Shows:

**Match Score**
- Large percentage (94%)
- Match quality label

**Skills Matched**
- Progress bar
- 4 / 5 matched

**Experience**
- Your level: Intermediate

**Interests**
- Progress bar
- 3 / 4 matched

**Difficulty**
- Beginner-friendly / Intermediate / Advanced

**Activity**
- Highly Active / Active / Moderate

**Why You May Like This**
- Bullet points
- Specific reasons

---

## 🎮 Pro Tips

### Speed Through Repos:
1. Use **arrow keys** instead of clicking
2. **← ← → ← →** - Super fast!
3. **S** to bookmark interesting ones
4. **Enter** to view details when needed

### Smart Filtering:
1. Start with **language filter**
2. Add **difficulty** if needed
3. **Activity level** for maintained repos
4. **Reset** and try different combo

### Mobile:
1. **Swipe** is fastest
2. **Tap buttons** if you prefer
3. Card takes **full screen**
4. Very **thumb-friendly**

---

## 🎯 Common Workflows

### Finding Your First Contribution:
```
1. Filter: Beginner experience
2. Filter: Easy difficulty
3. Look for high match scores (90+)
4. Read "Good ways to contribute"
5. Interested on perfect matches
6. View Project for winners
```

### Quick 15-Minute Session:
```
1. Don't use filters (see top matches)
2. Use keyboard arrows
3. Skip low scores (< 75%)
4. Save interesting ones (S key)
5. Review saved later
```

### Finding TypeScript Projects:
```
1. Filter: Language = TypeScript
2. Filter: Activity = Highly Active
3. Sort: Most Stars
4. Swipe through top results
5. Interested on best matches
```

---

## 🐛 Troubleshooting

### Card Won't Swipe:
- Make sure you're dragging the **top card**
- Drag at least **150px** to dismiss
- Try using **keyboard** or **buttons** instead

### No Repositories:
- Check **filters** - may be too restrictive
- Click **Reset** button
- Try different **search query**

### Match Score Seems Wrong:
- Scores are **calculated** from your profile
- Update profile in **/onboarding**
- Higher score = better match

### Can't Find Saved Repos:
- Go to **/dashboard**
- Click **Saved** button
- Or navigate to **/dashboard/saved**

---

## 📱 Mobile Tips

### Best Practices:
1. **Portrait mode** works best
2. **Swipe** is more natural than buttons
3. **Long-press** to drag (don't flick)
4. Use **landscape** for more space

### Gestures:
- **Swipe left** → Skip
- **Swipe right** → Interested
- **Tap bookmark** → Save
- **Tap card** → View details

---

## ⌨️ All Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **←** | Skip repository |
| **→** | Mark interested |
| **S** | Save/bookmark |
| **Enter** | View project |
| **Escape** | Close modals |

---

## 🎯 What Happens When...

### You Skip:
- Card exits left
- Repository removed from **current session**
- Won't see it again today
- Next card appears

### You Mark Interested:
- Card exits right
- Saved to **interested list**
- Find later in dashboard
- Next card appears

### You Save:
- Bookmark icon fills
- Added to **saved repos**
- Card **stays visible**
- Can continue browsing

### You View Project:
- Navigate to **repository details**
- See full information
- Can return to discovery

### You Run Out of Cards:
- "**All Caught Up**" screen
- **Start Over** button
- Or apply new filters

---

## 🎨 Design Details

### Why It Looks This Way:

**Dark Background**
- Professional developer aesthetic
- Easy on eyes for long sessions
- Makes content pop

**Large Cards**
- All info visible at once
- No scrolling needed
- Focus on one decision

**Green for Interested**
- Positive action
- Success color
- Clear call-to-action

**Smooth Animations**
- 60fps performance
- Spring physics
- Satisfying to use

---

## 🚀 Getting Started

### First Time?
1. Visit **/discover**
2. See your first match
3. Read the match reasons
4. Try **dragging the card left**
5. Try **arrow keys**
6. Find your perfect repo!

### Returning User?
1. Check **filters** for new criteria
2. Use **keyboard shortcuts** for speed
3. Review **saved repos** in dashboard
4. Keep that **streak** going!

---

## 💡 Remember

- **One repository at a time** - Stay focused
- **Trust the match score** - It knows your profile
- **Keyboard is fastest** - Arrow keys for power users
- **Save liberally** - Bookmark anything interesting
- **Filters help** - Narrow down when overwhelmed

---

## 🎉 You're Ready!

Start discovering your next open-source contribution! 🚀

**http://localhost:3000/discover**
