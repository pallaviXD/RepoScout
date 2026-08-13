# 🎯 Discovery vs Explore - Two Ways to Find Repositories

RepoScout now offers **two distinct interfaces** for finding repositories:

---

## 📍 `/discover` - Swipe-Based Discovery

### Purpose:
**Quick decision-making on one repository at a time**

### Best For:
- ✅ Finding your next contribution
- ✅ Quick evaluation sessions
- ✅ When you want curated recommendations
- ✅ Decision fatigue reduction
- ✅ Mobile browsing

### Experience:
- **One repository at a time**
- **Swipe left** (skip) or **swipe right** (interested)
- **Large card format** with all details visible
- **Match score** prominently displayed
- **Keyboard shortcuts** for power users
- **Focused decision-making**

### Visual:
```
┌──────────────────────────┐
│                          │
│   SINGLE LARGE CARD      │
│   All Details Visible    │
│   Swipe to Decide        │
│                          │
└──────────────────────────┘
```

### User Flow:
1. See match score (94%)
2. Read why it matches
3. Review repository details
4. Make decision (Skip/Save/Interested/View)
5. Next repository appears

### Ideal Scenarios:
- "Show me good projects one at a time"
- "I have 10 minutes to find something interesting"
- "I want to quickly evaluate my best matches"
- "I'm on my phone browsing"

---

## 🔍 `/explore` - Grid-Based Browsing

### Purpose:
**Browse and compare multiple repositories at once**

### Best For:
- ✅ Research and comparison
- ✅ Specific technology searches
- ✅ Exploring trending projects
- ✅ Desktop power users
- ✅ Detailed filtering

### Experience:
- **Grid of repository cards**
- **Multiple repositories visible** (3 columns)
- **Compact card format** with key stats
- **Advanced filtering** and sorting
- **Pagination** for large result sets
- **Comparison shopping**

### Visual:
```
┌─────┐ ┌─────┐ ┌─────┐
│Card │ │Card │ │Card │
└─────┘ └─────┘ └─────┘
┌─────┐ ┌─────┐ ┌─────┐
│Card │ │Card │ │Card │
└─────┘ └─────┘ └─────┘
```

### User Flow:
1. Browse 9-12 repositories at once
2. Compare stars, forks, activity
3. Click interesting ones for details
4. Use filters to narrow down
5. Sort by different criteria

### Ideal Scenarios:
- "Show me all TypeScript projects"
- "I want to compare popular React libraries"
- "Let me browse trending repositories"
- "I need to see multiple options"

---

## 🤔 Which Should You Use?

### Use `/discover` When:
- 🎯 You want **personalized recommendations**
- ⚡ You need to make **quick decisions**
- 📱 You're on **mobile**
- 🎮 You prefer **one thing at a time**
- 🎲 You're **open to discovery**
- ⏱️ You have **limited time**

### Use `/explore` When:
- 🔍 You're **searching for something specific**
- 📊 You want to **compare multiple options**
- 💻 You're on **desktop with large screen**
- 📚 You're doing **research**
- 🎯 You have **specific criteria**
- 🕐 You have **time to browse**

---

## 🎨 Design Comparison

### `/discover` Design:
- **Background**: Pure black (#09090B)
- **Card**: Large (760px × 680px)
- **Layout**: Centered with sidebars
- **Focus**: Single repository
- **Interaction**: Drag/swipe gestures
- **Match Score**: Prominent (large number)
- **Details**: Fully expanded
- **Actions**: Four clear buttons

### `/explore` Design:
- **Background**: Light/dark theme
- **Cards**: Compact grid items
- **Layout**: Responsive grid (3 cols)
- **Focus**: Multiple repositories
- **Interaction**: Click/tap
- **Match Score**: Small badge
- **Details**: Summarized
- **Actions**: Quick-action icons

---

## 🔄 Navigation Flow

### Typical User Journey:

```
Landing Page
     ↓
[Choose your path]
     ↓
┌────────────────────────────────┐
│                                │
DISCOVER              EXPLORE
(Swipe Mode)          (Grid Mode)
     ↓                     ↓
One at a time        Multiple at once
     ↓                     ↓
Make decision        Click for details
     ↓                     ↓
Next card            Browse more
     ↓                     ↓
Find perfect         Compare options
match                     ↓
     ↓               Select favorite
     ↓                     ↓
     └────────┬────────────┘
              ↓
       View Project Details
              ↓
       /projects/[owner]/[repo]
```

---

## 📊 Feature Comparison Matrix

| Feature | Discover | Explore |
|---------|----------|---------|
| **Card Size** | Large (760px) | Compact (grid) |
| **Cards Visible** | 1 at a time | 9-12 at once |
| **Swipe Gestures** | ✅ Yes | ❌ No |
| **Keyboard Shortcuts** | ✅ Yes | ⚠️ Limited |
| **Match Score** | Large & prominent | Small badge |
| **Full Details** | ✅ All visible | ⚠️ Click to expand |
| **Filtering** | Basic | Advanced |
| **Sorting** | Limited | Multiple options |
| **Pagination** | N/A (stack) | ✅ Yes |
| **Mobile Optimized** | ✅ Perfect | ⚠️ Good |
| **Decision Making** | Binary (yes/no) | Comparative |
| **Time to Decision** | Fast | Slower |
| **Best For** | Focus | Research |

---

## 💡 Pro Tips

### Discover Page Tips:
- ⌨️ **Use keyboard shortcuts** - Arrow keys are faster than clicking
- 🔖 **Bookmark liberally** - Save button doesn't dismiss the card
- 🎯 **Trust the match score** - It's calculated from your profile
- 📊 **Check the right panel** - See detailed match breakdown
- 🔄 **Use filters** - Left panel narrows recommendations

### Explore Page Tips:
- 🔍 **Use search** - Find specific technologies
- 🏷️ **Use filters** - Language, stars, activity level
- 📊 **Sort options** - Try "Most Active" for quick contributions
- ⭐ **Check stars** - Popular = more support
- 🕐 **Check "Updated"** - Recent activity = maintained project

---

## 🎯 Real-World Examples

### Scenario 1: "I Have 15 Minutes"
**→ Use `/discover`**
- Quick swipe through top 10 matches
- Make instant yes/no decisions
- Save 2-3 interesting repos
- Done in 15 minutes

### Scenario 2: "I Need a React Library"
**→ Use `/explore`**
- Search: "React"
- Filter: Language = JavaScript
- Sort: Most Stars
- Compare top 10 results
- Read documentation
- Make informed choice

### Scenario 3: "Looking for First Contribution"
**→ Use `/discover`**
- Filter: Beginner-friendly
- Swipe through recommendations
- High match scores = good fit
- "Interested" on perfect match
- View project details

### Scenario 4: "Research for Work Project"
**→ Use `/explore`**
- Specific search terms
- Multiple tabs open
- Compare features side-by-side
- Check GitHub issues
- Bookmark several options

---

## 🚀 Future Integration

Both pages will eventually share:
- ✅ Same match algorithm
- ✅ Same saved repositories
- ✅ Same user preferences
- ✅ Same interested repositories
- ✅ Same skip history (session-based)

### Planned Sync:
```typescript
// Saved in Discover → Appears in Explore
saveRepository(repo) {
  // Updates both interfaces
  addToBookmarks(repo)
  showInExplore(repo, { saved: true })
}

// Interested in Discover → Highlighted in Explore
markInterested(repo) {
  // Visual indicator in both interfaces
  addToInterests(repo)
  highlightInExplore(repo)
}
```

---

## 🎨 Visual Identity

### Discover:
- **Vibe**: **Focused**, **immersive**, **intentional**
- **Colors**: **Dark theme**, green accents
- **Feel**: **Calm**, **one-thing-at-a-time**
- **Inspiration**: **Premium app**, not web page

### Explore:
- **Vibe**: **Open**, **browseable**, **flexible**
- **Colors**: **Lighter**, traditional UI
- **Feel**: **Efficient**, **research-oriented**
- **Inspiration**: **GitHub**, **search results**

---

## 📱 Mobile Considerations

### Discover on Mobile:
- ✅ **Perfect** - Designed for mobile-first
- ✅ Touch gestures work beautifully
- ✅ Full-screen cards
- ✅ No scrolling needed
- ✅ Thumb-friendly buttons

### Explore on Mobile:
- ⚠️ **Good but not ideal**
- Requires scrolling
- Grid becomes 1-2 columns
- Smaller cards
- More tapping

**Recommendation**: Use Discover on mobile, Explore on desktop

---

## 🎯 Success Metrics

### Discover KPIs:
- Time to decision per repository
- Swipe-through rate
- Interested percentage
- Session duration
- Return rate

### Explore KPIs:
- Search usage
- Filter usage
- Click-through rate
- Pagination depth
- Comparison behavior

---

## ✨ Summary

### Discover = **Fast & Focused**
One repository. One decision. Move on.

### Explore = **Browse & Compare**
Multiple options. Research mode. Take your time.

---

**Both interfaces serve different needs. Use the right tool for your current goal!** 🎯

- **Finding your next contribution?** → `/discover`
- **Researching libraries for work?** → `/explore`
- **On your phone?** → `/discover`
- **Comparing React frameworks?** → `/explore`
- **10 minutes to spare?** → `/discover`
- **Need detailed analysis?** → `/explore`

Pick your path and start discovering! 🚀
