'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubRepository } from '@/lib/types';
import { formatNumber, formatDate } from '@/lib/utils';
import { Star, GitFork, CircleDot, ExternalLink, Bookmark, CheckCircle, Code2 } from 'lucide-react';
import { GitHubWorkflowModal } from '@/components/github/github-workflow-modal';

interface RepositoryCardProps {
  repository: GitHubRepository;
  isSaved?: boolean;
  onToggleSave?: (repo: GitHubRepository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  isSaved = false,
  onToggleSave,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'repo',
          githubRepoId: String(repository.id),
          owner: repository.owner.login,
          repo: repository.name,
        }),
      });

      if (res.ok) {
        setSaved(!saved);
        if (onToggleSave) onToggleSave(repository);
      }
    } catch (err) {
      console.error('Failed to save repository:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-card hover:border-primary/40 transition-all duration-200 group">
      <div>
        {/* Header: Owner Avatar + Repo Title + Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {repository.owner.avatarUrl ? (
              <img
                src={repository.owner.avatarUrl}
                alt={repository.owner.login}
                className="w-8 h-8 rounded-full border border-border shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                {repository.owner.login[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground block truncate font-mono">
                {repository.owner.login}
              </span>
              <Link
                href={`/projects/${repository.owner.login}/${repository.name}`}
                className="text-base font-bold text-foreground hover:text-primary transition-colors block truncate"
              >
                {repository.name}
              </Link>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors shrink-0"
            title={saved ? 'Remove Bookmark' : 'Save Repository'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <CardDescription className="text-xs text-secondary-foreground line-clamp-2 mb-4 h-9">
          {repository.description || 'No description provided for this repository.'}
        </CardDescription>

        {/* Language & Good First Issues Indicator */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {repository.language && (
            <Badge variant="primary" className="font-mono text-[11px]">
              {repository.language}
            </Badge>
          )}

          {repository.hasGoodFirstIssues && (
            <Badge variant="success" className="text-[11px]">
              Good First Issues
            </Badge>
          )}

          {repository.isActive && (
            <Badge variant="outline" className="text-[11px] text-emerald-400 border-emerald-500/30">
              ● Active
            </Badge>
          )}
        </div>

        {/* Topics */}
        {repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 max-h-12 overflow-hidden">
            {repository.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="text-[10px] px-2 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border/40 font-mono"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Metrics & Actions */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Star className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              {formatNumber(repository.stars)}
            </span>
            <span className="flex items-center gap-1 hover:text-primary transition-colors">
              <GitFork className="w-3.5 h-3.5" />
              {formatNumber(repository.forks)}
            </span>
            <span className="flex items-center gap-1">
              <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
              {repository.openIssuesCount}
            </span>
          </div>

          <Link href={`/projects/${repository.owner.login}/${repository.name}`}>
            <Button variant="ghost" size="sm" className="text-xs py-1 px-2 hover:text-primary">
              View <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        <Button
          onClick={() => setWorkflowOpen(true)}
          variant="outline"
          size="sm"
          className="w-full text-xs py-1.5"
        >
          <Code2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />
          Fork & Clone
        </Button>
      </div>

      <GitHubWorkflowModal
        isOpen={workflowOpen}
        onClose={() => setWorkflowOpen(false)}
        owner={repository.owner.login}
        repo={repository.name}
      />
    </Card>
  );
};
