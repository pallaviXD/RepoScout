import { NextAuthOptions, getServerSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { prisma } from '../db/prisma';

// Check for required environment variables
const hasGitHubAuth = 
  process.env.GITHUB_CLIENT_ID?.trim() && 
  process.env.GITHUB_CLIENT_SECRET?.trim();

export const authOptions: NextAuthOptions = {
  providers: hasGitHubAuth
    ? [
        GithubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!.trim(),
          clientSecret: process.env.GITHUB_CLIENT_SECRET!.trim(),
          authorization: {
            params: {
              scope: 'read:user user:email public_repo',
            },
          },
        }),
      ]
    : [],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email && !account?.providerAccountId) return false;

      const githubId = account?.providerAccountId || user.id;
      const username = (profile as any)?.login || user.name?.toLowerCase().replace(/\s+/g, '') || `user_${githubId}`;

      try {
        // Upsert user in database
        await prisma.user.upsert({
          where: { githubId },
          update: {
            name: user.name || username,
            email: user.email,
            avatarUrl: user.image,
            username,
          },
          create: {
            githubId,
            username,
            name: user.name || username,
            email: user.email,
            avatarUrl: user.image,
            experienceLevel: 'BEGINNER',
          },
        });
      } catch (err) {
        console.error('Error syncing user during sign in:', err);
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.githubId = account.providerAccountId;
        token.username = (profile as any).login;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).githubId = token.githubId;
        (session.user as any).username = token.username;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const githubId = (session.user as any).githubId;
  const username = (session.user as any).username;

  if (!githubId && !username) return null;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubId: githubId || undefined },
        { username: username || undefined },
        { email: session.user.email || undefined },
      ],
    },
    include: {
      skills: true,
      interests: true,
      preferences: true,
      savedRepos: true,
      savedIssues: true,
      contributions: true,
    },
  });

  return user;
}
