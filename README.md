# RepoScout

Discover open-source projects and issues that match your skills. Track your contributions, earn badges, and grow your developer journey.

## Features

### Core Features
- **Smart Recommendations** - AI-powered matching of issues to your skills and interests
- **GitHub Integration** - One-click fork, clone, and contribute workflow
- **Good First Issues** - Curated beginner-friendly issues from top repositories
- **Issue Discovery** - Advanced search and filtering for open-source contributions
- **Repository Explorer** - Browse trending and popular repositories

### User Experience
- **Personalized Dashboard** - View recommendations based on your profile
- **Analytics Dashboard** - Track contributions, streaks, points, and progress
- **Badges & Achievements** - Earn rewards for milestones and consistency
- **Level System** - Progress through levels as you contribute more
- **Contribution Heatmap** - Visualize your activity over time
- **Bookmarking** - Save repositories and issues for later

### Authentication
- **GitHub OAuth** - Secure sign-in with GitHub
- **Public Mode** - Browse without authentication
- **Session Management** - Persistent login with NextAuth

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with GitHub OAuth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **API**: GitHub REST API

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account (for authentication features)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/RepoScout.git
cd RepoScout
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file with GitHub OAuth credentials (see Setup section)

5. Initialize the database
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

6. Start the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## GitHub OAuth Setup

### Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" then "New OAuth App"
3. Fill in the details:
   - **Application name**: RepoScout
   - **Homepage URL**: http://localhost:3000
   - **Callback URL**: http://localhost:3000/api/auth/callback/github
4. Copy your Client ID and generate a Client Secret

### Update Environment Variables

Add to your `.env` file:
```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
NEXT_PUBLIC_GITHUB_AUTH_ENABLED="true"
NEXT_PUBLIC_GITHUB_CLIENT_ID="your-client-id"
```

### Optional: GitHub Token

For higher API rate limits (5000/hour vs 60/hour):
1. Create a token at [GitHub Tokens](https://github.com/settings/tokens)
2. Select `public_repo` scope
3. Add to `.env`:
```env
GITHUB_TOKEN="your-token"
```

## Project Structure

```
RepoScout/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard & analytics
│   ├── explore/           # Repository explorer
│   ├── issues/            # Issue browser
│   └── profile/           # User profiles
├── components/            # React components
│   ├── github/           # Fork & clone workflow
│   ├── issues/           # Issue cards & modals
│   ├── layout/           # Navbar, footer, providers
│   ├── projects/         # Repository cards
│   ├── recommendation/   # Recommendation engine UI
│   └── ui/               # Base UI components
├── lib/                   # Utility libraries
│   ├── auth/             # NextAuth configuration
│   ├── db/               # Prisma client
│   ├── github/           # GitHub API integration
│   └── recommendation/   # Match scoring algorithms
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## Key Features Explained

### Analytics Dashboard
- **Level & Progress**: Track your contributor level and points
- **Stats Grid**: Forks, issues closed, PRs merged, current streak
- **Contribution Heatmap**: Visual activity calendar (GitHub-style)
- **Badges**: Earn achievements for milestones
- **Recent Activity**: Timeline of your contributions

### Contribution Tracking
The app automatically tracks when you:
- Fork repositories (10 points)
- Open issues (5 points)
- Submit pull requests (15 points)
- Get PRs merged (25 points)
- Close issues (10 points)

### Badge System
Earn badges for:
- First Fork
- Contribution streaks (7, 30 days)
- Milestones (10, 25, 50, 100 contributions)
- Skill achievements (Issues closed, PRs merged)

### Match Scoring
Issues are scored based on:
- Skill match (your profile vs issue labels)
- Experience level alignment
- Interest relevance
- Contribution type preference

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npx prisma studio` - Open database GUI

## Database Schema

Key models:
- **User** - Profile, skills, interests, preferences
- **Contribution** - Tracked contributions with points
- **Badge** - Achievement definitions
- **UserBadge** - Earned badges
- **UserStats** - Aggregated statistics
- **SavedRepository** - Bookmarked repos
- **SavedIssue** - Bookmarked issues

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/auth/signin` - Sign-in page

### GitHub Integration
- `POST /api/github/fork` - Fork a repository

### User Data
- `POST /api/user/onboarding` - Save user preferences
- `POST /api/user/saved` - Bookmark repos/issues
- `GET /api/user/saved` - Get bookmarks

### Contributions
- `POST /api/contributions` - Track a contribution

## Environment Variables

Required:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-auth-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
```

Optional (GitHub features):
```env
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
NEXT_PUBLIC_GITHUB_AUTH_ENABLED="true"
NEXT_PUBLIC_GITHUB_CLIENT_ID=""
GITHUB_TOKEN=""
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Create production GitHub OAuth App
5. Deploy

### Other Platforms
- Works on any platform supporting Next.js
- Set environment variables in platform settings
- Configure GitHub OAuth callback URLs for production domain

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review documentation in `/docs` (if available)

## Acknowledgments

Built with:
- Next.js and React
- GitHub API
- Prisma ORM
- NextAuth.js
- Tailwind CSS
- Lucide Icons

---

Made with ❤️ for the open-source community
