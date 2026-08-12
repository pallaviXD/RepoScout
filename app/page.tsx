'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BackgroundVideo } from '@/components/hero/BackgroundVideo';
import { searchRepositories } from '@/lib/github/repositories';
import { searchIssues } from '@/lib/github/issues';
import { formatNumber } from '@/lib/utils';
import { HeroContent } from '@/components/hero/HeroContent';
import { Navbar } from '@/components/layout/navbar';
import { Code2, Filter, GitPullRequest, ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [repoResult, setRepoResult] = useState({ totalCount: 0 });
  const [issueResult, setIssueResult] = useState({ totalCount: 0 });
  const [gfiResult, setGfiResult] = useState({ totalCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repo, issue, gfi] = await Promise.all([
          searchRepositories({ minStars: 50, perPage: 1 }),
          searchIssues({ perPage: 1 }),
          searchIssues({ isGoodFirstIssue: true, perPage: 1 }),
        ]);
        setRepoResult(repo);
        setIssueResult(issue);
        setGfiResult(gfi);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const repoCount      = repoResult.totalCount  || 100000;
  const openIssueCount = issueResult.totalCount || 50000;
  const gfiCount       = gfiResult.totalCount   || 10000;

  const features = [
    {
      number: '01',
      title:  'Repository Discovery Engine',
      category: 'DISCOVERY',
      desc:   'Search public GitHub repositories filtered deterministically by star trajectory, primary language, active contributor velocity, and good-first-issue density.',
      link:   '/explore',
    },
    {
      number: '02',
      title:  'Actionable Issue Explorer',
      category: 'ISSUES',
      desc:   'Browse open tickets categorized by normalized tags, skill prerequisites, and estimated contribution difficulty.',
      link:   '/issues',
    },
    {
      number: '03',
      title:  'Deterministic Match Score',
      category: 'ALGORITHM',
      desc:   'Transparent 100% mathematical scoring algorithm evaluating technical skills (35%), experience level (20%), domain interests (15%), and past activity.',
      link:   '/onboarding',
    },
    {
      number: '04',
      title:  'Good First Issue Hub',
      category: 'BEGINNERS',
      desc:   'Normalized GitHub label indexing engine isolating welcoming entry-point issues for first-time open-source contributors.',
      link:   '/good-first-issues',
    },
    {
      number: '05',
      title:  '10-Step Guided Contribution Checklist',
      category: 'WORKFLOW',
      desc:   'Interactive step-by-step roadmap tailored specifically for submitting bug fixes, documentation patches, features, and test coverage.',
      link:   '/issues',
    },
    {
      number: '06',
      title:  'Personalized Developer Dashboard',
      category: 'WORKSPACE',
      desc:   'Track bookmarked repositories, save priority issues, customize match weightings, and monitor your open-source journey.',
      link:   '/dashboard',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Define your technical profile',
      desc:  'Select your primary programming languages, frameworks, experience level, and preferred contribution domains in under 60 seconds.',
      icon:  Code2,
      badge: 'Input'
    },
    {
      step: '02',
      title: 'Algorithmic matching engine',
      desc:  'RepoScout scans thousands of real-time GitHub repositories and active issues using deterministic skill matching without black-box opaque AI.',
      icon:  Filter,
      badge: 'Processing'
    },
    {
      step: '03',
      title: 'Execute & submit pull requests',
      desc:  'Follow our structured contribution guidance checklist and submit your PR directly on the original GitHub repository.',
      icon:  GitPullRequest,
      badge: 'Outcome'
    },
  ];

  if (loading) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <section className="relative w-full min-h-[100vh] flex flex-col justify-between overflow-hidden bg-black pt-[90px] pb-12 px-6 sm:px-12">
        <BackgroundVideo src="https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8" />
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-[1]" />
        <div className="relative z-10 my-auto py-12">
          <HeroContent />
        </div>
      </section>

      <section className="w-full bg-black text-white border-y border-white/10 py-16">
        <div className="max-w-[1078px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {[
              { label: 'REPOSITORIES INDEXED', count: `${formatNumber(repoCount)}+`, detail: 'Public GitHub repositories continuously synced' },
              { label: 'OPEN ISSUES AVAILABLE', count: `${formatNumber(openIssueCount)}+`, detail: 'Actionable tickets categorized by difficulty' },
              { label: 'GOOD FIRST ISSUES', count: `${formatNumber(gfiCount)}+`, detail: 'Beginner-friendly tickets ready for first PRs' },
            ].map((stat, idx) => (
              <div key={idx} className="border-l border-white/20 pl-6 space-y-2 hover:border-white transition-colors duration-500">
                <span className="text-[11px] tracking-[0.12em] uppercase text-white/50 font-mono block">
                  {stat.label}
                </span>
                <p className="text-[44px] sm:text-[54px] font-[400] leading-none tracking-[-0.03em] font-sans text-white">
                  {stat.count}
                </p>
                <p className="text-[13px] text-white/60 font-[300] leading-relaxed pt-1">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-black text-white py-24 border-b border-white/10">
        <div className="max-w-[1078px] mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[11px] tracking-[0.14em] text-white/50 uppercase font-mono block mb-3">
                // SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-[38px] sm:text-[54px] font-[300] leading-[1.05] tracking-[-0.02em] text-white font-serif">
                How RepoScout Works.
              </h2>
            </div>
            <p className="text-[15px] text-white/60 font-[300] max-w-sm leading-relaxed">
              From developer profile definition to submitting your pull request on GitHub in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc, icon: Icon, badge }) => (
              <div
                key={step}
                className="group liquid-glass p-8 flex flex-col justify-between h-full bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 rounded-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[11px] font-mono tracking-widest px-3 py-1 rounded-full border border-white/20 text-white/80">
                      STEP {step}
                    </span>
                    <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-[22px] font-[400] text-white mb-3 leading-snug">
                    {title}
                  </h3>
                  <p className="text-[14px] text-white/60 font-[300] leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                  <span className="uppercase tracking-wider font-mono">{badge}</span>
                  <ChevronRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-black text-white py-24">
        <div className="max-w-[1078px] mx-auto px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[11px] tracking-[0.14em] text-white/50 uppercase font-mono block mb-3">
                // PLATFORM CAPABILITIES
              </span>
              <h2 className="text-[38px] sm:text-[54px] font-[300] leading-[1.05] tracking-[-0.02em] text-white font-serif">
                Engineered for Open Source.
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-[13px] font-[400] text-white border-b border-white/40 pb-1 hover:border-white transition-all"
            >
              <span>Explore all features</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border-t border-white/15">
            {features.map((f, i) => (
              <Link
                key={i}
                href={f.link}
                className="group flex flex-col md:flex-row md:items-center justify-between py-7 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] px-4 transition-all duration-500 rounded-lg"
              >
                <div className="flex items-start md:items-center gap-6 md:gap-12 flex-1 pr-6">
                  <span className="text-[12px] font-mono text-white/40 font-medium w-8">
                    {f.number}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[20px] font-[400] text-white group-hover:translate-x-1 transition-transform duration-500">
                        {f.title}
                      </h3>
                      <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 border border-white/20 text-white/60 uppercase rounded-full">
                        {f.category}
                      </span>
                    </div>
                    <p className="text-[14px] text-white/60 font-[300] max-w-2xl leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-2 text-[12px] font-[400] text-white shrink-0">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-black text-white py-28 relative overflow-hidden border-t border-white/10">
        <div
          className="absolute -right-20 -bottom-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
          }}
        />
        <div className="max-w-[1078px] mx-auto px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono tracking-[0.14em] text-white/50 uppercase block mb-4">
              READY TO CONTRIBUTE?
            </span>
            <h2 className="text-[44px] sm:text-[68px] font-[300] leading-[1.0] tracking-[-0.03em] text-white mb-6 font-serif">
              Scout your next open-source milestone today.
            </h2>
            <p className="text-[16px] text-white/70 font-[300] leading-relaxed mb-10">
              Set up your skills profile in under 2 minutes. RepoScout will automatically prioritize the most relevant open issues across GitHub.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/onboarding" className="btn-pill-hero text-center justify-center">
                <span>Start Matching Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/good-first-issues" className="btn-pill-hero-ghost text-center justify-center">
                <span>Browse Good First Issues</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
