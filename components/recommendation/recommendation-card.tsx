'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MatchScoreBadge } from './match-score-badge';
import { DifficultyBadge } from './difficulty-badge';
import { GitHubIssue, MatchScoreResult } from '@/lib/types';
import { ExternalLink, CheckCircle2, Bookmark, BookOpen, MessageSquare } from 'lucide-react';
import { IssueGuidanceModal } from '@/components/issues/issue-guidance-modal';
import { formatDate } from '@/lib/utils';

interface RecommendationCardProps {
  issue: GitHubIssue;
  matchResult: MatchScoreResult;
  isSaved?: boolean;
  onToggleSave?: (issue: GitHubIssue) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  issue,
  matchResult,
  isSaved = false,
  onToggleSave,
}) => {
  const [guidanceModalOpen, setGuidanceModalOpen] = useState(false);
  const [savedState, setSavedState] = useState(isSaved);
  const [saving, setSaving] = useState(false);

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
      <Card className="flex flex-col justify-between h-full bg-card hover:border-primary/50 relative group">
        <div>
          {/* Header Row: Score + Difficulty */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <MatchScoreBadge score={matchResult.totalScore} size="sm" />
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty={matchResult.difficulty} />
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                title={savedState ? 'Remove Bookmark' : 'Save Issue'}
              >
                <Bookmark className={`w-4 h-4 ${savedState ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title & Repo */}
          <CardHeader className="p-0 mb-3">
            <p className="text-xs font-mono text-primary font-semibold mb-1">
              {issue.repository.fullName} <span className="text-muted-foreground">#{issue.number}</span>
            </p>
            <CardTitle className="text-base font-bold line-clamp-2 hover:text-primary transition-colors">
              <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                {issue.title}
              </a>
            </CardTitle>
          </CardHeader>

          {/* Deterministic "Why this matches" List */}
          <div className="space-y-1.5 mb-4 bg-background/60 p-3 rounded-lg border border-border/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Why this matches
            </p>
            {matchResult.reasons.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-foreground/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{reason.replace(/^[✓⚡]\s*/, '')}</span>
              </div>
            ))}
          </div>

          {/* You'll practice tags */}
          {matchResult.learningOpportunities.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">You&apos;ll practice / tech stack:</p>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.learningOpportunities.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs bg-muted/30">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">Updated {formatDate(issue.updatedAt)}</span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGuidanceModalOpen(true)}
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
        isOpen={guidanceModalOpen}
        onClose={() => setGuidanceModalOpen(false)}
        issueTitle={issue.title}
        issueUrl={issue.htmlUrl}
        repoName={issue.repository.fullName}
      />
    </>
  );
};
