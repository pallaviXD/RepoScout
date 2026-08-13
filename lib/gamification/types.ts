// Gamification System Types
export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalContributions: number;
  completedQuests: number;
  coins: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  type: 'issue' | 'repo' | 'contribution' | 'profile';
}

export interface LiveActivity {
  id: string;
  username: string;
  avatar: string;
  action: 'opened_pr' | 'closed_issue' | 'forked_repo' | 'starred_repo' | 'completed_quest';
  repoName: string;
  timestamp: Date;
  xpGained?: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  contributions: number;
  trend: 'up' | 'down' | 'same';
}
