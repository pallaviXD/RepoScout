import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink, Trash2, ArrowLeft, GitFork, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function SavedItemsPage({
  searchParams,
}: {
  searchParams: { tab?: 'projects' | 'issues' };
}) {
  const user = await getCurrentUser();
  const activeTab = searchParams.tab || 'projects';

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Sign in Required</h1>
        <p className="text-sm text-secondary-foreground">Please sign in to access your saved repositories and issues.</p>
        <a href="/api/auth/signin">
          <Button variant="primary">Sign in with GitHub</Button>
        </a>
      </div>
    );
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2 font-mono">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-primary" /> Saved Bookmarks
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-border pb-4">
        <Link href="/dashboard/saved?tab=projects">
          <Button
            variant={activeTab === 'projects' ? 'primary' : 'outline'}
            size="sm"
            className="font-bold"
          >
            Saved Projects ({savedRepos.length})
          </Button>
        </Link>

        <Link href="/dashboard/saved?tab=issues">
          <Button
            variant={activeTab === 'issues' ? 'primary' : 'outline'}
            size="sm"
            className="font-bold"
          >
            Saved Issues ({savedIssues.length})
          </Button>
        </Link>
      </div>

      {/* Tab Content */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {savedRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRepos.map((r) => (
                <Card key={r.id} className="p-5 flex flex-col justify-between h-full bg-card hover:border-primary/40">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-primary font-semibold">{r.owner}</span>
                    <h3 className="text-base font-bold text-foreground">{r.repo}</h3>
                    <p className="text-xs text-muted-foreground font-mono">Saved {formatDate(r.createdAt.toISOString())}</p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between mt-4">
                    <Link href={`/projects/${r.owner}/${r.repo}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                    <a
                      href={`https://github.com/${r.owner}/${r.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground font-mono"
                    >
                      GitHub →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl space-y-2">
              <p className="text-sm font-bold text-foreground">No saved projects yet</p>
              <p className="text-xs text-muted-foreground">Browse repositories on the Explore page and click the bookmark icon to save.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-4">
          {savedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedIssues.map((issue) => {
                let labels: string[] = [];
                try {
                  labels = JSON.parse(issue.labels);
                } catch (e) {}

                return (
                  <Card key={issue.id} className="p-5 flex flex-col justify-between h-full bg-card hover:border-primary/40">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-primary font-semibold">
                        {issue.owner}/{issue.repo} #{issue.issueNumber}
                      </span>
                      <h3 className="text-sm font-bold text-foreground line-clamp-2">{issue.title}</h3>
                      <div className="flex flex-wrap gap-1">
                        {labels.slice(0, 3).map((l) => (
                          <Badge key={l} variant="outline" className="text-[10px]">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between mt-4 text-xs">
                      <span className="text-muted-foreground font-mono">Saved {formatDate(issue.createdAt.toISOString())}</span>
                      <a
                        href={`https://github.com/${issue.owner}/${issue.repo}/issues/${issue.issueNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="primary" size="sm" className="text-xs py-1 px-2.5">
                          View Issue <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl space-y-2">
              <p className="text-sm font-bold text-foreground">No saved issues yet</p>
              <p className="text-xs text-muted-foreground">Click the bookmark icon on any issue card to save it here for later.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
