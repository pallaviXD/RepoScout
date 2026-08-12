'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubIssue, MatchScoreResult } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { ExternalLink, BookOpen, MessageSquare, Bookmark, GitFork } from 'lucide-react';
import { normalizeGitHubLabels } from '@/lib/github/normalize';
import { DifficultyBadge } from '@/components/recommendation/difficulty-badge';
import { MatchScoreBadge } from '@/components/recommendation/match-score-badge';
import { IssueGuidanceModal } from './issue-guidance-modal';
import { GitHubWorkflowModal } from '@/components/github/github-workflow-modal';

interface IssueCardProps {
  issue: GitHubIssue;
  matchResult?: MatchScoreResult | null;
  isSaved?: boolean;
  onToggleSave?: (issue: GitHubIssue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  matchResult,
  isSaved = false,
  onToggleSave,
}) => {
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [savedState, setSavedState] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const normalized = normalizeGitHubLabels(issue.labels);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'issue',
          githubIssueId: String(issue.id),
          owner: issue.repository.owner,
          repo: issue.repository.name,
          issueNumber: issue.number,
          title: issue.title,
          labels: issue.labels.map((l) => l.name),
        }),
      });

      if (res.ok) {
        setSavedState(!savedState);
        if (onToggleSave) onToggleSave(issue);
      }
    } catch (err) {
      console.error('Failed to save issue:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col justify-between h-full bg-card hover:border-primary/40 transition-all duration-200">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary font-semibold">
                {issue.repository.fullName} <span className="text-muted-foreground">#{issue.number}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {matchResult && <MatchScoreBadge score={matchResult.totalScore} size="sm" />}
              <DifficultyBadge difficulty={normalized.estimatedDifficulty} />
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                title={savedState ? 'Remove Bookmark' : 'Save Issue'}
              >
                <Bookmark className={`w-4 h-4 ${savedState ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>

          {/* Issue Title */}
          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-base font-bold line-clamp-2 hover:text-primary transition-colors">
              <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                {issue.title}
              </a>
            </CardTitle>
          </CardHeader>

          {/* Body snippet */}
          {issue.body && (
            <p className="text-xs text-secondary-foreground line-clamp-2 mb-4 leading-relaxed font-sans">
              {issue.body.replace(/[#*`_~]/g, '')}
            </p>
          )}

          {/* Label Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {normalized.isGoodFirstIssue && (
              <Badge variant="success" className="text-[11px]">
                Good First Issue
              </Badge>
            )}
            {normalized.isHelpWanted && (
              <Badge variant="warning" className="text-[11px]">
                Help Wanted
              </Badge>
            )}
            {normalized.isDocumentation && (
              <Badge variant="purple" className="text-[11px]">
                Docs
              </Badge>
            )}
            {issue.labels.slice(0, 3).map((label) => (
              <Badge key={label.name} variant="outline" className="text-[10px] bg-muted/30">
                {label.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer info & actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            {issue.author.avatarUrl && (
              <img src={issue.author.avatarUrl} alt={issue.author.login} className="w-5 h-5 rounded-full" />
            )}
            <span>Updated {formatDate(issue.updatedAt)}</span>
            {issue.commentsCount > 0 && (
              <span className="flex items-center gap-1 ml-1 text-muted-foreground font-mono">
                <MessageSquare className="w-3 h-3" /> {issue.commentsCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWorkflowOpen(true)}
              className="text-xs py-1 px-2.5"
            >
              <GitFork className="w-3.5 h-3.5 mr-1 text-green-600" /> Work on This
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuidanceOpen(true)}
              className="text-xs py-1 px-2.5"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1 text-primary" /> Guide
            </Button>

            <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" className="text-xs py-1 px-2.5">
                View Issue <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <IssueGuidanceModal
        isOpen={guidanceOpen}
        onClose={() => setGuidanceOpen(false)}
        issueTitle={issue.title}
        issueUrl={issue.htmlUrl}
        repoName={issue.repository.fullName}
      />

      <GitHubWorkflowModal
        isOpen={workflowOpen}
        onClose={() => setWorkflowOpen(false)}
        owner={issue.repository.owner}
        repo={issue.repository.name}
        issueNumber={issue.number}
        issueTitle={issue.title}
      />
    </>
  );
};
