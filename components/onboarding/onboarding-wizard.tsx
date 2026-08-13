'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ExperienceLevel, ContributionType } from '@/lib/types';
import { Check, Plus, ArrowRight, ArrowLeft, Sparkles, Code, Brain, Target, Compass } from 'lucide-react';

const POPULAR_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Python',
  'Java',
  'Node.js',
  'Go',
  'Rust',
  'C++',
  'SQL',
  'PostgreSQL',
  'Docker',
  'Cloud',
];

const INTEREST_OPTIONS = [
  'Web Development',
  'AI / ML',
  'Cybersecurity',
  'DevTools',
  'Mobile',
  'Cloud',
  'Blockchain',
  'Accessibility',
  'Developer Experience',
  'Documentation',
];

const CONTRIBUTION_OPTIONS: { type: ContributionType; label: string; description: string }[] = [
  { type: 'BUG_FIX', label: 'Bug Fixes', description: 'Reproduce issues and patch unexpected behavior' },
  { type: 'FEATURE', label: 'Features', description: 'Implement new capabilities and components' },
  { type: 'DOCUMENTATION', label: 'Documentation', description: 'Improve guides, API docs, and code examples' },
  { type: 'TESTING', label: 'Testing', description: 'Expand unit test suites and integration coverage' },
  { type: 'UI_UX', label: 'UI / UX', description: 'Refine visual design, responsiveness, and layout' },
  { type: 'PERFORMANCE', label: 'Performance', description: 'Optimize load times, memory, and algorithms' },
  { type: 'SECURITY', label: 'Security', description: 'Audit dependencies and address vulnerability reports' },
  { type: 'REFACTORING', label: 'Refactoring', description: 'Clean up code structure and decrease technical debt' },
];

export const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['TypeScript', 'React']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('BEGINNER');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Web Development']);
  const [selectedContributionTypes, setSelectedContributionTypes] = useState<ContributionType[]>(['BUG_FIX', 'DOCUMENTATION']);

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleContributionType = (type: ContributionType) => {
    if (selectedContributionTypes.includes(type)) {
      setSelectedContributionTypes(selectedContributionTypes.filter((t) => t !== type));
    } else {
      setSelectedContributionTypes([...selectedContributionTypes, type]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: selectedSkills,
          experienceLevel,
          interests: selectedInterests,
          contributionTypes: selectedContributionTypes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Progress Header */}
      <div className="mb-8 text-center space-y-2">
        <span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
          Step {currentStep} of 4 — Setup Profile
        </span>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Welcome to RepoScout
        </h1>
        <p className="text-sm text-secondary-foreground">
          Let&apos;s personalize your open-source discovery recommendations.
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto h-2 rounded-full bg-muted mt-6 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-sm text-center">
          {errorMsg}
        </div>
      )}

      <Card className="p-6 md:p-8 bg-card border-card-border shadow-glow-sm">
        
        {/* Step 1: Skills */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Code className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Step 1 — Skills</h2>
                <p className="text-xs text-muted-foreground">What technologies do you know or want to use?</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary text-black border-primary font-bold shadow-glow-sm'
                        : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {skill}
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomSkill} className="flex gap-2 pt-2">
              <Input
                placeholder="Add custom skill (e.g. GraphQL, Elixir, WebAssembly)"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
              />
              <Button type="submit" variant="outline" className="shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </form>

            {selectedSkills.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2 font-mono">Selected Skills ({selectedSkills.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-mono border border-primary/30 flex items-center gap-1">
                      {s}
                      <button onClick={() => toggleSkill(s)} className="hover:text-accent-rose">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Step 2 — Experience Level</h2>
                <p className="text-xs text-muted-foreground">What is your current open-source contribution experience?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { level: 'BEGINNER' as const, title: 'Beginner', desc: 'Looking for good first issues, clear documentation, and helpful maintainers.' },
                { level: 'INTERMEDIATE' as const, title: 'Intermediate', desc: 'Comfortable fixing bugs, adding feature enhancements, and writing tests.' },
                { level: 'ADVANCED' as const, title: 'Advanced', desc: 'Ready for complex core architecture, performance optimizations, and breaking changes.' },
              ].map(({ level, title, desc }) => {
                const isSelected = experienceLevel === level;
                return (
                  <div
                    key={level}
                    onClick={() => setExperienceLevel(level)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-glow-sm text-foreground'
                        : 'bg-background border-border hover:border-border/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-foreground">{title}</h3>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-black' : 'border-border'}`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-secondary-foreground">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Target className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Step 3 — Interests</h2>
                <p className="text-xs text-muted-foreground">What domain or project categories interest you?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 text-primary border-primary'
                        : 'bg-background text-secondary-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Contribution Types */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Compass className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Step 4 — Preferred Contribution Types</h2>
                <p className="text-xs text-muted-foreground">What kind of tasks do you enjoy tackling?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTRIBUTION_OPTIONS.map(({ type, label, description }) => {
                const isSelected = selectedContributionTypes.includes(type);
                return (
                  <div
                    key={type}
                    onClick={() => toggleContributionType(type)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'bg-background border-border hover:border-border/80 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-foreground">{label}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-secondary-foreground">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-8 border-t border-border flex items-center justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
              Next Step <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" isLoading={loading} onClick={handleSubmit} className="px-6">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Recommendations
            </Button>
          )}
        </div>

      </Card>
    </div>
  );
};
