import React from 'react';

interface LanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
}

interface LanguageBarProps {
  languages: LanguageBreakdown[];
}

const colorMap: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Ruby: '#701516',
};

export const LanguageBar: React.FC<LanguageBarProps> = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Visual Multi-segment bar */}
      <div className="h-2.5 w-full rounded-full bg-muted flex overflow-hidden">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: colorMap[lang.name] || '#22c55e',
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Language Legends */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-secondary-foreground font-mono">
        {languages.slice(0, 6).map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: colorMap[lang.name] || '#22c55e' }}
            />
            <span className="font-semibold text-foreground">{lang.name}</span>
            <span className="text-muted-foreground">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
