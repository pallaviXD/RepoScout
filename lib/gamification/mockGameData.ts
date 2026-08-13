// Mock Gamification Data
import { Achievement, DailyQuest, LiveActivity, LeaderboardEntry, UserStats } from './types';

export const MOCK_USER_STATS: UserStats = {
  xp: 2450,
  level: 6,
  streak: 12,
  totalContributions: 34,
  completedQuests: 8,
  coins: 450,
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pr',
    title: 'First Steps',
    description: 'Opened your first pull request',
    icon: 'PR',
    unlockedAt: new Date('2024-01-10'),
    rarity: 'common',
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    description: 'Saved 10 repositories',
    icon: 'STAR',
    unlockedAt: new Date('2024-01-15'),
    rarity: 'rare',
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: 'FIRE',
    unlockedAt: new Date('2024-01-18'),
    rarity: 'epic',
  },
  {
    id: 'issue_hunter',
    title: 'Issue Hunter',
    description: 'View 50 different issues',
    icon: 'SCOUT',
    progress: 34,
    maxProgress: 50,
    rarity: 'common',
  },
  {
    id: 'language_master',
    title: 'Polyglot',
    description: 'Contribute to 5 different languages',
    icon: 'LANG',
    progress: 3,
    maxProgress: 5,
    rarity: 'epic',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Active coding sessions after midnight',
    icon: 'NIGHT',
    rarity: 'rare',
  },
  {
    id: 'community_hero',
    title: 'Community Hero',
    description: 'Help 20+ developers through contributions',
    icon: 'HERO',
    progress: 12,
    maxProgress: 20,
    rarity: 'legendary',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 5 issues in one day',
    icon: 'BOLT',
    rarity: 'epic',
  },
];

export const MOCK_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest_1',
    title: 'Issue Explorer',
    description: 'Browse 5 open issues',
    progress: 3,
    maxProgress: 5,
    xpReward: 50,
    coinReward: 25,
    completed: false,
    type: 'issue',
  },
  {
    id: 'quest_2',
    title: 'Repository Scout',
    description: 'Save 2 interesting repositories',
    progress: 1,
    maxProgress: 2,
    xpReward: 75,
    coinReward: 30,
    completed: false,
    type: 'repo',
  },
  {
    id: 'quest_3',
    title: 'Skill Builder',
    description: 'View issues in TypeScript',
    progress: 2,
    maxProgress: 3,
    xpReward: 40,
    coinReward: 20,
    completed: false,
    type: 'issue',
  },
  {
    id: 'quest_4',
    title: 'Profile Enhancer',
    description: 'Update your skills profile',
    progress: 0,
    maxProgress: 1,
    xpReward: 100,
    coinReward: 50,
    completed: false,
    type: 'profile',
  },
];

export const MOCK_LIVE_ACTIVITIES: LiveActivity[] = [
  {
    id: 'act_1',
    username: 'sarah_codes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    action: 'opened_pr',
    repoName: 'react-toolkit',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    xpGained: 50,
  },
  {
    id: 'act_2',
    username: 'dev_mike',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    action: 'closed_issue',
    repoName: 'awesome-ui',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    xpGained: 75,
  },
  {
    id: 'act_3',
    username: 'alex_dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    action: 'completed_quest',
    repoName: 'Daily Challenge',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    xpGained: 100,
  },
  {
    id: 'act_4',
    username: 'jenny_tech',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jenny',
    action: 'forked_repo',
    repoName: 'typescript-utils',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: 'act_5',
    username: 'code_ninja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
    action: 'starred_repo',
    repoName: 'next-components',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'code_master_99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
    xp: 15420,
    level: 13,
    contributions: 142,
    trend: 'up',
  },
  {
    rank: 2,
    username: 'dev_queen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=queen',
    xp: 14800,
    level: 12,
    contributions: 135,
    trend: 'same',
  },
  {
    rank: 3,
    username: 'react_warrior',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=warrior',
    xp: 13950,
    level: 12,
    contributions: 128,
    trend: 'down',
  },
  {
    rank: 4,
    username: 'opensource_hero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero',
    xp: 12300,
    level: 11,
    contributions: 115,
    trend: 'up',
  },
  {
    rank: 5,
    username: 'js_ninja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jsninja',
    xp: 11750,
    level: 11,
    contributions: 98,
    trend: 'up',
  },
  {
    rank: 6,
    username: 'you',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
    xp: 2450,
    level: 6,
    contributions: 34,
    trend: 'up',
  },
];

// Generate random activities
export function generateRandomActivity(): LiveActivity {
  const usernames = ['alex_tech', 'sarah_dev', 'mike_codes', 'emma_builds', 'john_scripts', 'lisa_hacks'];
  const actions: LiveActivity['action'][] = ['opened_pr', 'closed_issue', 'forked_repo', 'starred_repo', 'completed_quest'];
  const repos = ['awesome-toolkit', 'react-hooks', 'api-server', 'ui-components', 'dev-utils', 'code-snippets'];
  
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const repoName = repos[Math.floor(Math.random() * repos.length)];
  
  return {
    id: `act_${Date.now()}_${Math.random()}`,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    action,
    repoName,
    timestamp: new Date(),
    xpGained: action === 'completed_quest' ? 100 : action === 'opened_pr' ? 75 : action === 'closed_issue' ? 75 : undefined,
  };
}
