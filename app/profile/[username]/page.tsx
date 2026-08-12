import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getGitHubUserProfile } from '@/lib/github/users';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Code, Brain, Target, Compass, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function DeveloperProfilePage({ params }: PageProps) {
  const { username } = params;

  // Search user in DB or GitHub API
  const dbUser = await prisma.user.findUnique({
    where: { username },
    include: {
      skills: true,
      interests: true,
      preferences: true,
      savedRepos: true,
      savedIssues: true,
    },
  });

  const ghProfile = await getGitHubUserProfile(username);

  if (!dbUser && !ghProfile.profile) {
    notFound();
  }

  const name = dbUser?.name || ghProfile.profile?.name || username;
  const avatarUrl = dbUser?.avatarUrl || ghProfile.profile?.avatarUrl || '';
  const bio = dbUser?.bio || ghProfile.profile?.bio || 'Developer and Open Source Contributor';
  const experienceLevel = dbUser?.experienceLevel || 'BEGINNER';
  const githubUrl = ghProfile.profile?.htmlUrl || `https://github.com/${username}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Header */}
      <Card className="p-6 md:p-8 bg-card border-card-border shadow-glow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full border-2 border-primary/50 shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {name[0]?.toUpperCase()}
            </div>
          )}

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">{name}</h1>
                <p className="text-sm font-mono text-primary font-semibold">@{username}</p>
              </div>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="w-4 h-4" /> View GitHub Profile
                </Button>
              </a>
            </div>

            <p className="text-sm text-secondary-foreground leading-relaxed">{bio}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-primary" /> Level: {experienceLevel}
              </span>
              {ghProfile.profile?.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> GitHub Joined {formatDate(ghProfile.profile.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Public Activity Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border text-center font-mono text-sm">
          <div>
            <span className="text-xl font-bold text-foreground">{dbUser?.savedRepos.length || 0}</span>
            <span className="text-xs text-muted-foreground block font-sans uppercase">Projects Saved</span>
          </div>
          <div>
            <span className="text-xl font-bold text-primary">{dbUser?.savedIssues.length || 0}</span>
            <span className="text-xs text-muted-foreground block font-sans uppercase">Issues Bookmarked</span>
          </div>
          <div>
            <span className="text-xl font-bold text-emerald-400">{ghProfile.profile?.publicRepos || 0}</span>
            <span className="text-xs text-muted-foreground block font-sans uppercase">Public GitHub Repos</span>
          </div>
        </div>
      </Card>

      {/* Skills & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" /> Developer Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {dbUser?.skills.map((s) => (
              <Badge key={s.id} variant="primary" className="text-xs font-mono py-1 px-3">
                {s.skillName}
              </Badge>
            )) || <span className="text-xs text-muted-foreground">No explicit skills set yet.</span>}
          </div>
        </Card>

        {/* Interests */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Domain Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {dbUser?.interests.map((i) => (
              <Badge key={i.id} variant="outline" className="text-xs bg-muted/40 py-1 px-3">
                {i.interestName}
              </Badge>
            )) || <span className="text-xs text-muted-foreground">No explicit interests set yet.</span>}
          </div>
        </Card>

      </div>

    </div>
  );
}
