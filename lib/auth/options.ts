// Demo mode - No authentication required
// This is a frontend-only demo for project submission

export type UserWithRelations = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  experienceLevel: string;
  skills: Array<{ id: string; skillName: string; level: string }>;
  interests: Array<{ id: string; interestName: string }>;
  preferences: Array<{ id: string; type: string }>;
  savedRepos: Array<any>;
  savedIssues: Array<any>;
  contributions: Array<any>;
  badges: Array<any>;
  stats: any;
};

// Demo user for frontend showcase
export const DEMO_USER: UserWithRelations = {
  id: 'demo-user-1',
  name: 'Demo Developer',
  username: 'demo-dev',
  email: 'demo@reposcout.dev',
  avatarUrl: 'https://github.com/github.png',
  bio: 'Frontend Developer | Open Source Enthusiast | Building amazing things',
  experienceLevel: 'INTERMEDIATE',
  skills: [
    { id: '1', skillName: 'TypeScript', level: 'ADVANCED' },
    { id: '2', skillName: 'React', level: 'ADVANCED' },
    { id: '3', skillName: 'Next.js', level: 'INTERMEDIATE' },
    { id: '4', skillName: 'Node.js', level: 'INTERMEDIATE' },
    { id: '5', skillName: 'Python', level: 'BEGINNER' },
  ],
  interests: [
    { id: '1', interestName: 'Web Development' },
    { id: '2', interestName: 'Open Source' },
    { id: '3', interestName: 'UI/UX Design' },
    { id: '4', interestName: 'DevOps' },
  ],
  preferences: [
    { id: '1', type: 'BUG_FIX' },
    { id: '2', type: 'FEATURE' },
    { id: '3', type: 'DOCUMENTATION' },
  ],
  savedRepos: [
    { id: '1', owner: 'demo', repo: 'awesome-ui' },
    { id: '2', owner: 'demo', repo: 'react-hooks' },
    { id: '3', owner: 'demo', repo: 'api-server' },
  ],
  savedIssues: [
    { id: '1', owner: 'demo', repo: 'awesome-ui', issueNumber: 123 },
    { id: '2', owner: 'demo', repo: 'react-hooks', issueNumber: 456 },
  ],
  contributions: [
    { id: '1', type: 'PR_OPENED', repoName: 'demo/awesome-ui', title: 'Add dark mode', createdAt: '2024-01-15' },
    { id: '2', type: 'ISSUE_CLOSED', repoName: 'demo/react-hooks', title: 'Fix memory leak', createdAt: '2024-01-14' },
    { id: '3', type: 'PR_MERGED', repoName: 'demo/api-server', title: 'Update docs', createdAt: '2024-01-13' },
    { id: '4', type: 'FORK', repoName: 'demo/code-editor', title: 'Forked repository', createdAt: '2024-01-12' },
    { id: '5', type: 'PR_OPENED', repoName: 'demo/form-validator', title: 'Improve error messages', createdAt: '2024-01-11' },
  ],
  badges: [
    { id: '1', badge: { name: 'First Fork', icon: 'GitFork', description: 'Forked your first repository' } },
    { id: '2', badge: { name: 'PR Champion', icon: 'Trophy', description: 'Opened 5 pull requests' } },
    { id: '3', badge: { name: 'Bug Hunter', icon: 'Bug', description: 'Closed 10 issues' } },
  ],
  stats: {
    totalContributions: 42,
    totalPoints: 385,
    currentStreak: 7,
    longestStreak: 12,
    repositoriesForked: 8,
    issuesClosed: 15,
    pullRequestsMerged: 12,
    level: 3,
    nextLevelPoints: 500,
  },
};

// Return demo user for all pages
export async function getCurrentUser(): Promise<UserWithRelations | null> {
  // Always return demo user for frontend showcase
  return DEMO_USER;
}

// Dummy auth options (not used but needed for compatibility)
export const authOptions = {
  providers: [],
  secret: 'demo-secret',
};
