import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const saveRepoSchema = z.object({
  type: z.literal('repo'),
  githubRepoId: z.string(),
  owner: z.string(),
  repo: z.string(),
});

const saveIssueSchema = z.object({
  type: z.literal('issue'),
  githubIssueId: z.string(),
  owner: z.string(),
  repo: z.string(),
  issueNumber: z.number(),
  title: z.string(),
  labels: z.array(z.string()),
});

const saveSchema = z.discriminatedUnion('type', [saveRepoSchema, saveIssueSchema]);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [savedRepos, savedIssues] = await Promise.all([
    prisma.savedRepository.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.savedIssue.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ savedRepos, savedIssues });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to save items.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = saveSchema.parse(body);

    if (parsed.type === 'repo') {
      const saved = await prisma.savedRepository.upsert({
        where: {
          userId_owner_repo: {
            userId: user.id,
            owner: parsed.owner,
            repo: parsed.repo,
          },
        },
        create: {
          userId: user.id,
          githubRepoId: parsed.githubRepoId,
          owner: parsed.owner,
          repo: parsed.repo,
        },
        update: {},
      });
      return NextResponse.json({ success: true, item: saved, type: 'repo' });
    } else {
      const saved = await prisma.savedIssue.upsert({
        where: {
          userId_owner_repo_issueNumber: {
            userId: user.id,
            owner: parsed.owner,
            repo: parsed.repo,
            issueNumber: parsed.issueNumber,
          },
        },
        create: {
          userId: user.id,
          githubIssueId: parsed.githubIssueId,
          owner: parsed.owner,
          repo: parsed.repo,
          issueNumber: parsed.issueNumber,
          title: parsed.title,
          labels: JSON.stringify(parsed.labels),
        },
        update: {},
      });
      return NextResponse.json({ success: true, item: saved, type: 'issue' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const issueNumber = searchParams.get('issueNumber');

    if (type === 'repo' && owner && repo) {
      await prisma.savedRepository.deleteMany({
        where: { userId: user.id, owner, repo },
      });
      return NextResponse.json({ success: true, message: 'Repository removed' });
    }

    if (type === 'issue' && owner && repo && issueNumber) {
      await prisma.savedIssue.deleteMany({
        where: { userId: user.id, owner, repo, issueNumber: parseInt(issueNumber, 10) },
      });
      return NextResponse.json({ success: true, message: 'Issue removed' });
    }

    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to remove saved item' }, { status: 500 });
  }
}
