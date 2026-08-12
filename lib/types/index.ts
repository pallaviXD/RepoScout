export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type ContributionType =
  | 'BUG_FIX'
  | 'FEATURE'
  | 'DOCUMENTATION'
  | 'TESTING'
  | 'UI_UX'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'REFACTORING';

export interface UserPreferences {
  skills: string[];
  experienceLevel: ExperienceLevel;
  interests: string[];
  contributionTypes: ContributionType[];
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  description: string | null;
  stars: number;
  forks: number;
  openIssuesCount: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  htmlUrl: string;
  hasGoodFirstIssues?: boolean;
  isActive?: boolean;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  labels: {
    id: number;
    name: string;
    color: string;
    description?: string;
  }[];
  author: {
    login: string;
    avatarUrl: string;
  };
  repository: {
    owner: string;
    name: string;
    fullName: string;
    description?: string | null;
    stars?: number;
    language?: string | null;
  };
}

export interface MatchScoreResult {
  totalScore: number; // 0 - 100
  skillMatch: number; // 0 - 35
  experienceMatch: number; // 0 - 20
  interestMatch: number; // 0 - 15
  difficultyMatch: number; // 0 - 10
  repositoryActivity: number; // 0 - 10
  technologyMatch: number; // 0 - 10
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reasons: string[];
  learningOpportunities: string[];
}

export interface StepGuidance {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface ContributionGuidance {
  title: string;
  contributionType: ContributionType;
  overview: string;
  checklist: StepGuidance[];
  generalBestPractices: string[];
}
