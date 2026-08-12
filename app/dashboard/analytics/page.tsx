import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/options';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, GitFork, GitPullRequest, Star, Flame, Award, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch user stats
  const stats = await prisma.userStats.findUnique({
    where: { userId: user.id }
  });

  // Fetch recent contributions
  const contributions = await prisma.contribution.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Fetch user badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' }
  });

  // Calculate level progress
  const currentStats = stats || {
    totalContributions: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    repositoriesForked: 0,
    issuesClosed: 0,
    pullRequestsMerged: 0,
    level: 1,
    nextLevelPoints: 100
  };

  const levelProgress = (currentStats.totalPoints % currentStats.nextLevelPoints) / currentStats.nextLevelPoints * 100;

  // Generate contribution heatmap data (last 12 weeks)
  const weeks = 12;
  const days = 7;
  const contributionMap = new Map<string, number>();
  
  contributions.forEach(contrib => {
    const date = new Date(contrib.createdAt).toISOString().split('T')[0];
    contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
  });

  const today = new Date();
  const heatmapData = Array.from({ length: weeks }, (_, weekIdx) => {
    return Array.from({ length: days }, (_, dayIdx) => {
      const date = new Date(today);
      date.setDate(date.getDate() - ((weeks - weekIdx - 1) * 7 + (days - dayIdx - 1)));
      const dateStr = date.toISOString().split('T')[0];
      return {
        date: dateStr,
        count: contributionMap.get(dateStr) || 0
      };
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your open-source journey, contributions, and achievements
        </p>
      </div>

      {/* Level & Progress */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Level {currentStats.level}</h2>
              <p className="text-xs text-muted-foreground">Open Source Contributor</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{currentStats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress to Level {currentStats.level + 1}</span>
            <span>{Math.floor(levelProgress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {currentStats.nextLevelPoints - (currentStats.totalPoints % currentStats.nextLevelPoints)} points to next level
          </p>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <GitFork className="w-5 h-5 text-blue-500" />
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{currentStats.repositoriesForked}</p>
          <p className="text-xs text-muted-foreground">Repositories Forked</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{currentStats.issuesClosed}</p>
          <p className="text-xs text-muted-foreground">Issues Closed</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <GitPullRequest className="w-5 h-5 text-purple-500" />
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{currentStats.pullRequestsMerged}</p>
          <p className="text-xs text-muted-foreground">PRs Merged</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <Flame className="w-5 h-5 text-orange-500" />
            <Target className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{currentStats.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
          {currentStats.longestStreak > 0 && (
            <p className="text-xs text-muted-foreground/70">Best: {currentStats.longestStreak} days</p>
          )}
        </Card>
      </div>

      {/* Contribution Heatmap */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Contribution Activity
          </h3>
          <p className="text-xs text-muted-foreground">{currentStats.totalContributions} total contributions</p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {heatmapData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => {
                  const intensity = day.count === 0 ? 0 : Math.min(4, Math.ceil(day.count / 2));
                  const colors = [
                    'bg-muted',
                    'bg-primary/20',
                    'bg-primary/40',
                    'bg-primary/60',
                    'bg-primary'
                  ];
                  return (
                    <div
                      key={dayIdx}
                      className={`w-3 h-3 rounded-sm ${colors[intensity]} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer`}
                      title={`${day.date}: ${day.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`w-3 h-3 rounded-sm ${['bg-muted', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary'][i]}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>

      {/* Badges & Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges & Achievements
        </h3>
        
        {userBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {userBadges.map(({ badge, earnedAt }) => (
              <div key={badge.id} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  <p className="text-xs text-primary mt-1">+{badge.points} points</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No badges earned yet</p>
            <p className="text-xs mt-1">Start contributing to unlock achievements!</p>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Recent Contributions
        </h3>
        
        {contributions.length > 0 ? (
          <div className="space-y-3">
            {contributions.map((contrib) => {
              const icons: Record<string, any> = {
                FORK: GitFork,
                PR_OPENED: GitPullRequest,
                PR_MERGED: GitPullRequest,
                ISSUE_OPENED: CheckCircle2,
                ISSUE_CLOSED: CheckCircle2,
                COMMIT: CheckCircle2
              };
              const Icon = icons[contrib.type] || CheckCircle2;
              
              return (
                <div key={contrib.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    contrib.status === 'MERGED' ? 'bg-purple-500/10' :
                    contrib.status === 'COMPLETED' ? 'bg-green-500/10' : 'bg-blue-500/10'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      contrib.status === 'MERGED' ? 'text-purple-500' :
                      contrib.status === 'COMPLETED' ? 'text-green-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {contrib.title || `${contrib.type.replace('_', ' ').toLowerCase()}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contrib.repoOwner}/{contrib.repoName} · {new Date(contrib.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={contrib.status === 'MERGED' ? 'default' : 'outline'} className="text-xs">
                    +{contrib.points} pts
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No contributions tracked yet</p>
            <p className="text-xs mt-1">Fork a repository to get started!</p>
          </div>
        )}
      </Card>

    </div>
  );
}
