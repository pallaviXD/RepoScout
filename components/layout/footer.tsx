import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

/**
 * monopo saigon Footer
 * ─────────────────────────────────────────────────────────────────
 * White background, no card fill
 * Text: 11px Roobert/Inter weight 400, #6d6d6d (felt-gray)
 * 8px line gaps between address lines
 * Hairline top border: 1px solid rgba(0,0,0,0.10)
 * No icons beyond minimal GitHub mark
 * No green/accent colors
 */
export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black/10 bg-white pt-16 pb-12 mt-20">
      <div className="max-w-[1078px] mx-auto px-10">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">

          {/* Brand block */}
          <div className="md:col-span-2 space-y-[8px]">
            <Link
              href="/"
              className="font-sans text-[16px] font-[400] text-obsidian leading-none hover:opacity-50 transition-opacity duration-[400ms] inline-block"
            >
              RepoScout
            </Link>
            <p
              className="text-[11px] font-[400] leading-[1.58] text-felt-gray max-w-[280px]"
              style={{ marginTop: '12px' }}
            >
              Scout your next open-source contribution.
              <br />
              Deterministic match ranking for developers.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-[400] text-felt-gray hover:text-obsidian transition-colors duration-[400ms] mt-[8px] pt-[8px]"
            >
              <Github className="w-[11px] h-[11px]" />
              GitHub
            </a>
          </div>

          {/* Discovery links */}
          <div className="space-y-[8px]">
            <p className="text-[11px] font-[600] text-obsidian tracking-[0.06em] uppercase mb-[16px]">
              Discovery
            </p>
            {[
              { label: 'Explore Repositories', href: '/explore' },
              { label: 'Issue Explorer',        href: '/issues' },
              { label: 'Good First Issues',     href: '/good-first-issues' },
              { label: 'Personalized Matching', href: '/onboarding' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-[11px] font-[400] leading-[1.36] text-felt-gray hover:text-obsidian transition-colors duration-[400ms]"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Developer links */}
          <div className="space-y-[8px]">
            <p className="text-[11px] font-[600] text-obsidian tracking-[0.06em] uppercase mb-[16px]">
              Developer
            </p>
            {[
              { label: 'Dashboard',       href: '/dashboard' },
              { label: 'Saved Bookmarks', href: '/dashboard/saved' },
              { label: 'My Profile',      href: '/profile/user' },
              { label: 'Settings',        href: '/settings' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-[11px] font-[400] leading-[1.36] text-felt-gray hover:text-obsidian transition-colors duration-[400ms]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/8 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] font-[400] text-felt-gray leading-[1.36]">
            © {year} RepoScout. Open-Source Discovery Platform.
          </p>
          <p className="text-[11px] font-[400] text-ash-mist leading-[1.36]">
            Built for developers who contribute.
          </p>
        </div>

      </div>
    </footer>
  );
};
