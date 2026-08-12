import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { forkRepository } from '@/lib/github/actions';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to fork repositories.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required fields: owner and repo' },
        { status: 400 }
      );
    }

    // Get user's GitHub access token from session
    const accessToken = (session as any).accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found. Please reconnect your GitHub account.' },
        { status: 403 }
      );
    }

    const result = await forkRepository(owner, repo, accessToken);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fork repository' },
        { status: 500 }
      );
    }

    // Track contribution
    try {
      const githubId = (session.user as any).githubId;
      const user = await prisma.user.findUnique({
        where: { githubId }
      });

      if (user) {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contributions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || ''
          },
          body: JSON.stringify({
            repoOwner: owner,
            repoName: repo,
            type: 'FORK',
            title: `Forked ${owner}/${repo}`,
            url: result.forkUrl,
            points: 10
          })
        });
      }
    } catch (trackError) {
      console.error('Failed to track contribution:', trackError);
      // Don't fail the fork if tracking fails
    }

    return NextResponse.json({
      success: true,
      forkUrl: result.forkUrl,
      cloneUrl: result.cloneUrl,
      message: 'Repository forked successfully!',
    });
  } catch (error: any) {
    console.error('Fork API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
