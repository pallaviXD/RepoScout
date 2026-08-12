import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { repoOwner, repoName, type, title, url, points = 10 } = body;

    if (!repoOwner || !repoName || !type || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const githubId = (session.user as any).githubId;
    const user = await prisma.user.findUnique({
      where: { githubId },
      include: { stats: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create contribution
    const contribution = await prisma.contribution.create({
      data: {
        userId: user.id,
        repoOwner,
        repoName,
        type,
        title,
        url,
        points,
        status: type === 'FORK' ? 'COMPLETED' : 'PENDING'
      }
    });

    // Update or create user stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastContribution = user.stats?.lastContribution;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Calculate streak
    let newStreak = 1;
    if (lastContribution) {
      const lastDate = new Date(lastContribution);
      lastDate.setHours(0, 0, 0, 0);
      
      if (lastDate.getTime() === today.getTime()) {
        // Same day, maintain streak
        newStreak = user.stats?.currentStreak || 1;
      } else if (lastDate.getTime() === yesterday.getTime()) {
        // Consecutive day, increment streak
        newStreak = (user.stats?.currentStreak || 0) + 1;
      }
    }

    const newTotalPoints = (user.stats?.totalPoints || 0) + points;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    const nextLevelPoints = newLevel * 100;

    if (user.stats) {
      await prisma.userStats.update({
        where: { userId: user.id },
        data: {
          totalContributions: { increment: 1 },
          totalPoints: { increment: points },
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, user.stats.longestStreak),
          repositoriesForked: type === 'FORK' ? { increment: 1 } : undefined,
          issuesClosed: type === 'ISSUE_CLOSED' ? { increment: 1 } : undefined,
          pullRequestsMerged: type === 'PR_MERGED' ? { increment: 1 } : undefined,
          lastContribution: new Date(),
          level: newLevel,
          nextLevelPoints
        }
      });
    } else {
      await prisma.userStats.create({
        data: {
          userId: user.id,
          totalContributions: 1,
          totalPoints: points,
          currentStreak: newStreak,
          longestStreak: newStreak,
          repositoriesForked: type === 'FORK' ? 1 : 0,
          issuesClosed: type === 'ISSUE_CLOSED' ? 1 : 0,
          pullRequestsMerged: type === 'PR_MERGED' ? 1 : 0,
          lastContribution: new Date(),
          level: newLevel,
          nextLevelPoints
        }
      });
    }

    // Check and award badges
    await checkAndAwardBadges(user.id, type, newTotalPoints);

    return NextResponse.json({ success: true, contribution });
  } catch (error) {
    console.error('Error tracking contribution:', error);
    return NextResponse.json({ error: 'Failed to track contribution' }, { status: 500 });
  }
}

async function checkAndAwardBadges(userId: string, contributionType: string, totalPoints: number) {
  const badges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true }
  });
  
  const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
  
  for (const badge of badges) {
    if (userBadgeIds.has(badge.id)) continue;
    
    let shouldAward = false;
    
    // Check badge requirements
    if (badge.category === 'CONTRIBUTION' && contributionType === 'FORK' && badge.name === 'First Fork') {
      shouldAward = true;
    } else if (badge.category === 'MILESTONE') {
      const stats = await prisma.userStats.findUnique({ where: { userId } });
      if (stats && stats.totalContributions >= badge.requirement) {
        shouldAward = true;
      }
    } else if (badge.category === 'STREAK') {
      const stats = await prisma.userStats.findUnique({ where: { userId } });
      if (stats && stats.currentStreak >= badge.requirement) {
        shouldAward = true;
      }
    }
    
    if (shouldAward) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });
      
      // Award badge points
      await prisma.userStats.update({
        where: { userId },
        data: {
          totalPoints: { increment: badge.points }
        }
      });
    }
  }
}
