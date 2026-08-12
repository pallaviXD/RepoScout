'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContributionType } from '@/lib/types';
import { getDeterministicContributionGuidance } from '@/lib/recommendation/guidance';
import {
  X,
  CheckCircle,
  ExternalLink,
  BookOpen,
  FileText,
  UserCheck,
  HelpCircle,
  GitFork,
  GitBranch,
  Bug,
  Code,
  CheckSquare,
  GitPullRequest,
  Layers,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface IssueGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueTitle: string;
  issueUrl: string;
  repoName: string;
}

const iconMap: Record<string, any> = {
  FileText,
  UserCheck,
  HelpCircle,
  GitFork,
  GitBranch,
  Bug,
  Code,
  CheckSquare,
  GitPullRequest,
  Layers,
  ShieldCheck,
  Play,
};

export const IssueGuidanceModal: React.FC<IssueGuidanceModalProps> = ({
  isOpen,
  onClose,
  issueTitle,
  issueUrl,
  repoName,
}) => {
  const [selectedType, setSelectedType] = useState<ContributionType>('BUG_FIX');

  if (!isOpen) return null;

  const guidance = getDeterministicContributionGuidance(selectedType, issueTitle);

  const contributionTypesList: { type: ContributionType; label: string }[] = [
    { type: 'BUG_FIX', label: 'Bug Fix' },
    { type: 'FEATURE', label: 'Feature' },
    { type: 'DOCUMENTATION', label: 'Documentation' },
    { type: 'TESTING', label: 'Testing' },
    { type: 'UI_UX', label: 'UI / UX' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-card-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              RepoScout Contribution Guidance
            </span>
            <h2 className="text-lg font-bold text-foreground line-clamp-1">{issueTitle}</h2>
            <p className="text-xs text-muted-foreground">{repoName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Contribution Type selector */}
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">
              Select Contribution Type:
            </label>
            <div className="flex flex-wrap gap-2">
              {contributionTypesList.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedType === type
                      ? 'bg-primary text-black border-primary font-semibold'
                      : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Banner */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm text-foreground">
            <p className="font-semibold text-primary mb-1">Strategy Overview</p>
            <p className="text-secondary-foreground text-xs leading-relaxed">{guidance.overview}</p>
          </div>

          {/* Step-by-Step 10-step Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Step-by-Step Checklist
            </h3>
            
            <div className="space-y-2">
              {guidance.checklist.map((step) => {
                const IconComponent = iconMap[step.iconName] || CheckCircle;
                return (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 hover:border-border/80 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center text-primary text-xs font-mono font-bold shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-secondary-foreground mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-4 rounded-lg bg-card border border-border text-xs space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Key Pull Request Best Practices:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {guidance.generalBestPractices.map((bp, i) => (
                <li key={i}>{bp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <a href={issueUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm" className="gap-2">
              <span>Open GitHub Issue</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>

      </div>
    </div>
  );
};
