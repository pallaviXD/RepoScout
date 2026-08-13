'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink, Trash2, ArrowLeft, GitFork, Star, CircleDot, Code2, Sparkles } from 'lucide-react';
import { MOCK_REPOSITORIES, MOCK_ISSUES } from '@/lib/github/mockData';
import { GitHubRepository, GitHubIssue } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'issues'>('projects');
  const [savedRepos, setSavedRepos] = useState<GitHubRepository[]>([]);
  const [savedIssues, setSavedIssues] = useState<GitHubIssue[]>([]);

  useEffect(() => {
    // Sync saved repos from localStorage + fallback mock repos
    try {
      const storedSavedRepoIds = JSON.parse(localStorage.getItem('reposcout_saved_repos') || '[]');
      const savedFromStorage = MOCK_REPOSITORIES.filter(r => storedSavedRepoIds.includes(r.id));
      
      // Default initial fallback list if empty
      const initialRepos = savedFromStorage.length > 0 
        ? savedFromStorage 
        : MOCK_REPOSITORIES.slice(0, 3);
      setSavedRepos(initialRepos);

      // Sync saved issues from localStorage + fallback mock issues
      const storedSavedIssueIds = JSON.parse(localStorage.getItem('reposcout_saved_issues') || '[]');
      const issuesFromStorage = MOCK_ISSUES.filter(i => storedSavedIssueIds.includes(i.id));
      const initialIssues = issuesFromStorage.length > 0 
        ? issuesFromStorage 
        : MOCK_ISSUES.slice(0, 2);
      setSavedIssues(initialIssues);
    } catch (e) {
      setSavedRepos(MOCK_REPOSITORIES.slice(0, 3));
      setSavedIssues(MOCK_ISSUES.slice(0, 2));
    }
  }, []);

  const handleRemoveRepo = (repoId: number) => {
    const updated = savedRepos.filter(r => r.id !== repoId);
    setSavedRepos(updated);
    try {
      const stored = JSON.parse(localStorage.getItem('reposcout_saved_repos') || '[]');
      const filtered = stored.filter((id: number) => id !== repoId);
      localStorage.setItem('reposcout_saved_repos', JSON.stringify(filtered));
    } catch (e) {}
  };

  const handleRemoveIssue = (issueId: number) => {
    const updated = savedIssues.filter(i => i.id !== issueId);
    setSavedIssues(updated);
    try {
      const stored = JSON.parse(localStorage.getItem('reposcout_saved_issues') || '[]');
      const filtered = stored.filter((id: number) => id !== issueId);
      localStorage.setItem('reposcout_saved_issues', JSON.stringify(filtered));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-border pb-6">
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-primary" /> Saved Workspaces & Bookmarks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Persisted local collection of your bookmarked repositories, issues, and active contribution targets.
          </p>
        </div>

        {/* Tabs & Status Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'projects' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('projects')}
              className="font-bold gap-2"
            >
              <Code2 className="w-4 h-4" />
              Saved Projects ({savedRepos.length})
            </Button>

            <Button
              variant={activeTab === 'issues' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('issues')}
              className="font-bold gap-2"
            >
              <CircleDot className="w-4 h-4 text-emerald-400" />
              Saved Issues ({savedIssues.length})
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-muted/30">
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" /> Demo Mode Local Storage Active
            </Badge>
          </div>
        </div>

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {savedRepos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRepos.map((repo) => (
                  <Card key={repo.id} className="p-6 flex flex-col justify-between h-full bg-card border-card-border hover:border-primary/40 transition-all group">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono text-primary font-semibold block">{repo.owner.login}</span>
                          <Link href={`/projects/${repo.owner.login}/${repo.name}`} className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                            {repo.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemoveRepo(repo.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-muted transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-secondary-foreground line-clamp-2">
                        {repo.description || 'No description provided.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        {repo.language && (
                          <Badge variant="primary" className="text-[10px]">
                            {repo.language}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-3 h-3 text-amber-400" /> {(repo.stars / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <GitFork className="w-3 h-3" /> {(repo.forks / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between mt-6">
                      <Link href={`/projects/${repo.owner.login}/${repo.name}`}>
                        <Button variant="outline" size="sm" className="text-xs gap-1">
                          View Overview <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/contributions?owner=${repo.owner.login}&repo=${repo.name}`}>
                        <Button variant="primary" size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                          Start Workflow →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-xl space-y-3">
                <p className="text-base font-bold text-foreground">No saved projects yet</p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Browse projects on Discover or Explore and click Save to add them to your local workspace.
                </p>
                <Link href="/explore">
                  <Button variant="primary" size="sm" className="mt-2">Explore Repositories</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Issues */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            {savedIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedIssues.map((issue) => (
                  <Card key={issue.id} className="p-6 flex flex-col justify-between h-full bg-card border-card-border hover:border-primary/40 transition-all group">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono text-primary font-semibold block">
                            {issue.repository.fullName} #{issue.number}
                          </span>
                          <h3 className="text-base font-bold text-foreground line-clamp-2 mt-0.5">
                            {issue.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemoveIssue(issue.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-muted transition-colors shrink-0"
                          title="Remove saved issue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {issue.labels.map((l) => (
                          <Badge key={l.name} variant="outline" className="text-[10px] bg-muted/20">
                            {l.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between mt-6 text-xs">
                      <span className="text-muted-foreground font-mono">Updated {formatDate(issue.updatedAt)}</span>
                      <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="sm" className="text-xs gap-1">
                          View Issue <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-border rounded-xl space-y-3">
                <p className="text-base font-bold text-foreground">No saved issues yet</p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Click the bookmark icon on any issue card in Issues or Good First Issues to save it here.
                </p>
                <Link href="/issues">
                  <Button variant="primary" size="sm" className="mt-2">Browse Issues</Button>
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
