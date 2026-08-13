// XP and Level Calculations
export function calculateLevel(xp: number): number {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  // XP needed for a specific level
  return Math.pow(level - 1, 2) * 100;
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  return xpForLevel(currentLevel + 1);
}

export function xpProgress(currentXp: number): { current: number; needed: number; percentage: number } {
  const currentLevel = calculateLevel(currentXp);
  const currentLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  
  const xpIntoLevel = currentXp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const percentage = Math.floor((xpIntoLevel / xpNeededForLevel) * 100);
  
  return {
    current: xpIntoLevel,
    needed: xpNeededForLevel,
    percentage: Math.min(100, Math.max(0, percentage))
  };
}

export function calculateXpReward(action: 'view_repo' | 'save_repo' | 'view_issue' | 'complete_quest' | 'daily_login'): number {
  const rewards = {
    view_repo: 5,
    save_repo: 15,
    view_issue: 10,
    complete_quest: 50,
    daily_login: 25,
  };
  return rewards[action] || 0;
}

export function getCoinReward(action: 'save_repo' | 'complete_quest' | 'level_up'): number {
  const rewards = {
    save_repo: 10,
    complete_quest: 25,
    level_up: 100,
  };
  return rewards[action] || 0;
}

// Streak calculations
export function calculateStreakBonus(streak: number): number {
  if (streak >= 30) return 2.0; // 100% bonus
  if (streak >= 14) return 1.5; // 50% bonus
  if (streak >= 7) return 1.25; // 25% bonus
  return 1.0;
}

export function getStreakBadgeText(streak: number): string {
  if (streak >= 100) return '100+ Days';
  if (streak >= 50) return '50+ Days';
  if (streak >= 30) return '30+ Days';
  if (streak >= 7) return '7+ Days';
  return 'Active';
}
