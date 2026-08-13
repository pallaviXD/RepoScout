'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { UserPreferences } from '@/lib/types';
import { Bell, ChevronDown, Star, GitPullRequest, GitBranch, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DashboardClientProps {
  user: any;
  userPref: UserPreferences;
  rankedRecommendations: any[];
}

// ── Deterministic pseudo-random (no Math.random) ──────────────────────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s) / 0xffffffff;
  };
}

// ── Mini Line Chart (SVG, no deps) ───────────────────────────────────────────
function LineChart({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  const w = 460, h = 140, pad = { top: 10, right: 10, bottom: 30, left: 30 };
  const inner = { w: w - pad.left - pad.right, h: h - pad.top - pad.bottom };
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * inner.w,
    y: pad.top + inner.h - (v / max) * inner.h,
  }));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = d + ` L${pts[pts.length - 1].x},${(pad.top + inner.h).toFixed(1)} L${pts[0].x},${(pad.top + inner.h).toFixed(1)} Z`;

  // X-axis labels — every ~7 days
  const labels = ['May 4', 'May 11', 'May 18', 'May 25', 'Jun 1'];
  const yTicks = [0, 5, 10, 15, 20];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[140px]">
      {/* Grid lines */}
      {yTicks.map(t => {
        const y = pad.top + inner.h - (t / 20) * inner.h;
        return (
          <g key={t}>
            <line x1={pad.left} y1={y} x2={pad.left + inner.w} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={pad.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t}</text>
          </g>
        );
      })}
      {/* Area */}
      <path d={area} fill={color} fillOpacity="0.08" />
      {/* Line */}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={l} x={pad.left + (i / (labels.length - 1)) * inner.w} y={h - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">{l}</text>
      ))}
    </svg>
  );
}

// ── Contribution Heatmap ──────────────────────────────────────────────────────
function Heatmap({ data }: { data: number[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const days = ['Mon', 'Wed', 'Fri'];
  const cols = 26; // weeks
  const rows = 7;
  const cell = 11, gap = 2;

  const color = (v: number) => {
    if (v === 0) return '#f0fdf4';
    if (v <= 1) return '#bbf7d0';
    if (v <= 3) return '#4ade80';
    if (v <= 5) return '#16a34a';
    return '#14532d';
  };

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex ml-8 mb-1">
        {months.map((m, i) => (
          <span key={m} style={{ width: `${Math.floor(cols / months.length) * (cell + gap)}px` }} className="text-[10px] text-gray-400">{m}</span>
        ))}
      </div>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-1" style={{ height: `${rows * (cell + gap) - gap}px` }}>
          {Array.from({ length: rows }).map((_, i) => (
            <span key={i} className="text-[9px] text-gray-400 leading-none" style={{ height: `${cell}px`, lineHeight: `${cell}px` }}>
              {i === 1 ? 'Mon' : i === 3 ? 'Wed' : i === 5 ? 'Fri' : ''}
            </span>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridTemplateRows: `repeat(${rows}, ${cell}px)`, gap: `${gap}px` }}>
          {data.map((v, i) => (
            <div key={i} title={`${v} contributions`} style={{ width: cell, height: cell, backgroundColor: color(v), borderRadius: 2 }} />
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 ml-8">
        <span className="text-[10px] text-gray-400 mr-1">Less</span>
        {[0, 1, 3, 5, 6].map(v => (
          <div key={v} style={{ width: cell, height: cell, backgroundColor: color(v), borderRadius: 2 }} />
        ))}
        <span className="text-[10px] text-gray-400 ml-1">More</span>
      </div>
    </div>
  );
}

// ── Donut Chart (SVG) ─────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 40, cx = 60, cy = 60, stroke = 22;
  let offset = 0;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const dashOffset = circumference - offset * circumference / total;
          offset += seg.value;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={dashOffset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-600 flex-1">{seg.label}</span>
            <span className="font-semibold text-gray-800">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal Bar Chart ──────────────────────────────────────────────────────
function HBarChart({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map(i => i.value));
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-gray-800 font-bold">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, iconBg }: { icon: React.ReactNode; label: string; value: string | number; sub: string; iconBg: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

export function DashboardClient({ user, userPref, rankedRecommendations }: DashboardClientProps) {
  const rand = seededRand(42);

  // Contribution activity data (last 30 days)
  const activityData = Array.from({ length: 30 }, () => Math.floor(rand() * 18));

  // Heatmap (26 weeks × 7 days = 182 cells)
  const heatmapData = Array.from({ length: 182 }, () => {
    const r = rand();
    return r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.72 ? 2 : r < 0.85 ? 4 : r < 0.93 ? 5 : 6;
  });

  const langSegments = [
    { label: 'TypeScript', value: 40, color: '#3b82f6' },
    { label: 'JavaScript', value: 25, color: '#22c55e' },
    { label: 'Python',     value: 15, color: '#a855f7' },
    { label: 'Go',         value: 10, color: '#f59e0b' },
    { label: 'Other',      value: 10, color: '#9ca3af' },
  ];

  const contribSegments = [
    { label: 'Pull Requests',  value: 45, color: '#3b82f6' },
    { label: 'Issues Closed',  value: 25, color: '#22c55e' },
    { label: 'Issues Opened',  value: 15, color: '#a855f7' },
    { label: 'Commits',        value: 10, color: '#f59e0b' },
    { label: 'Reviews',        value: 5,  color: '#9ca3af' },
  ];

  const repoImpact = [
    { label: 'vercel/next.js',           value: 12 },
    { label: 'facebook/react',           value: 8 },
    { label: 'microsoft/vscode',         value: 5 },
    { label: 'tailwindlabs/tailwindcss', value: 3 },
  ];

  const recentActivity = [
    { icon: GitPullRequest, color: 'text-blue-500',  text: 'Merged pull request in vercel/next.js',           sub: 'Fix: Improve error handling in router',     time: '2 hours ago' },
    { icon: CheckCircle2,   color: 'text-green-500', text: 'Closed issue in facebook/react',                  sub: 'Bug: State update not batching correctly',  time: '1 day ago' },
    { icon: AlertCircle,    color: 'text-purple-500',text: 'Opened issue in microsoft/vscode',                sub: 'Feature: Add support for custom themes',    time: '2 days ago' },
    { icon: MessageSquare,  color: 'text-orange-500',text: 'Commented on pull request in tailwindlabs/tailwindcss', sub: 'Add dark mode variant improvements', time: '3 days ago' },
  ];

  const savedRepos = [
    { name: 'vercel/next.js',           desc: 'The React Framework',                              stars: '132k' },
    { name: 'facebook/react',           desc: 'A declarative, efficient, and flexible JavaScript library', stars: '198k' },
    { name: 'microsoft/vscode',         desc: 'Visual Studio Code',                               stars: '159k' },
    { name: 'tailwindlabs/tailwindcss', desc: 'A utility-first CSS framework',                    stars: '75k' },
  ];

  const initials = (user?.name || 'Demo Developer').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track your open source journey and contribution impact</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Demo Developer'}</p>
                <p className="text-xs text-gray-400 leading-tight">{user?.email || 'demo@example.com'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* ── Stat Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 17l4-8 3 5 2-3 3 6H7z"/></svg>}
            label="Total XP"
            value="2,450"
            sub="+120 this week"
            iconBg="bg-blue-100"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
            label="Current Level"
            value="8"
            sub="Intermediate"
            iconBg="bg-green-100"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>}
            label="Current Streak"
            value="12"
            sub="Days in a row"
            iconBg="bg-orange-100"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>}
            label="Total Contributions"
            value="28"
            sub="Across all repositories"
            iconBg="bg-purple-100"
          />
        </div>

        {/* ── Charts Row: Line + Heatmap ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contribution Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Contribution Activity</h2>
                <p className="text-xs text-gray-400">Contributions over the last 30 days</p>
              </div>
              <button className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
                30 Days <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <LineChart data={activityData} color="#3b82f6" />
          </div>

          {/* Contribution Heatmap */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800">Contribution Heatmap</h2>
              <p className="text-xs text-gray-400">Your activity throughout the year</p>
            </div>
            <Heatmap data={heatmapData} />
          </div>
        </div>

        {/* ── Charts Row: Donut × 2 + HBar ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Languages */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Top Languages</h2>
            <p className="text-xs text-gray-400 mb-4">By contributions</p>
            <DonutChart segments={langSegments} />
          </div>

          {/* Contribution Types */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Contribution Types</h2>
            <p className="text-xs text-gray-400 mb-4">Distribution of your contributions</p>
            <DonutChart segments={contribSegments} />
          </div>

          {/* Repository Impact */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Repository Impact</h2>
            <p className="text-xs text-gray-400 mb-4">Your contributions by repository</p>
            <HBarChart items={repoImpact} />
          </div>
        </div>

        {/* ── Bottom Row: Recent Activity + Saved Repos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{item.text}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.sub}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
            <Link href="/explore" className="text-xs text-blue-500 hover:text-blue-700 font-medium mt-4 inline-block">
              View All Activity
            </Link>
          </div>

          {/* Saved Repositories */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">Saved Repositories</h2>
              <Link href="/saved" className="text-xs text-blue-500 hover:text-blue-700 font-medium">View All</Link>
            </div>
            <div className="space-y-3">
              {savedRepos.map((repo) => (
                <div key={repo.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{repo.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{repo.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0">
                    <Star className="w-3 h-3 text-amber-400" />
                    {repo.stars}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
