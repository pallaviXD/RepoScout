'use client';

import React from 'react';
import Link from 'next/link';
import { Star, GitFork, Circle } from 'lucide-react';

interface RepoCardMinimalProps {
  repo: {
    id: number;
    full_name: string;
    name: string;
    owner: { login: string };
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
  };
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
};

export function RepoCardMinimal({ repo }: RepoCardMinimalProps) {
  return (
    <Link
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[340px] group"
    >
      <div className="bg-white rounded-[28px] border border-[#d6d6d6] p-8 h-[280px] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-[1.02]">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-[21px] font-[600] leading-[1.2] tracking-[0.011em] text-[#1d1d1f] truncate mb-1 group-hover:text-[#0071e3] transition-colors">
                {repo.name}
              </h3>
              <p className="text-[14px] font-[400] text-[#86868b] truncate">
                {repo.owner.login}
              </p>
            </div>
          </div>

          <p className="text-[15px] font-[400] leading-[1.47] tracking-[-0.016em] text-[#1d1d1f] line-clamp-3 mb-6">
            {repo.description || 'No description available'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <Circle
                  className="w-3 h-3"
                  fill={LANGUAGE_COLORS[repo.language] || '#8e8e93'}
                  stroke="none"
                />
                <span className="text-[12px] font-[400] text-[#86868b]">
                  {repo.language}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#86868b]" />
              <span className="text-[12px] font-[400] text-[#86868b]">
                {repo.stargazers_count.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-[#86868b]" />
              <span className="text-[12px] font-[400] text-[#86868b]">
                {repo.forks_count.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
