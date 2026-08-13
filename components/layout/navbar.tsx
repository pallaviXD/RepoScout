'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Detect if we're on hero (home) page — controls whether navbar starts white or transparent
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Explore',           href: '/explore' },
    { name: 'Issues',            href: '/issues' },
    { name: 'Good First Issues', href: '/good-first-issues' },
    { name: 'Saved',             href: '/saved' },
    { name: 'Contributions',     href: '/contributions' },
    { name: 'Dashboard',         href: '/dashboard' },
  ];

  // On home page: white when scrolled, transparent (white text) when at top
  // On other pages: always white with dark text
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full h-[66px]',
        'transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white/96 backdrop-blur-md border-b border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.06)]'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* Logo & Demo Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className={cn(
              'font-sans text-[15px] font-semibold tracking-[-0.01em] leading-none',
              'transition-all duration-500',
              isTransparent ? 'text-white' : 'text-black'
            )}
          >
            RepoScout
          </Link>
          <span
            title="RepoScout is currently using curated demonstration data. GitHub authentication and live contribution actions are planned for the production version."
            className={cn(
              'text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded border transition-colors cursor-help',
              isTransparent
                ? 'bg-white/10 text-white/80 border-white/20'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            )}
          >
            DEMO MODE
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[12px] font-[400] tracking-[0.03em] leading-none',
                  'transition-all duration-500',
                  isActive
                    ? (isTransparent ? 'text-white font-semibold' : 'text-black font-semibold')
                    : (isTransparent ? 'text-white/60 hover:text-white' : 'text-[#6d6d6d] hover:text-black')
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: search only */}
        <div className="hidden sm:flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center group">
            <Search className={cn(
              'w-[13px] h-[13px] absolute left-0 pointer-events-none transition-colors duration-500',
              isTransparent ? 'text-white/50' : 'text-[#9a9a9a]'
            )} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-[120px] bg-transparent border-0 border-b pl-5 pr-2 py-1',
                'text-[12px] font-[400] placeholder:opacity-50',
                'focus:outline-none focus:w-[170px]',
                'transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-none',
                isTransparent
                  ? 'border-white/25 text-white placeholder:text-white focus:border-white/60'
                  : 'border-black/15 text-black placeholder:text-black focus:border-black/40'
              )}
            />
          </form>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn('lg:hidden p-1.5 transition-colors duration-500',
            isTransparent ? 'text-white/70 hover:text-white' : 'text-[#6d6d6d] hover:text-black')}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-black/10 px-8 pt-5 pb-7 space-y-5 animate-in">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-[13px] h-[13px] absolute left-0 text-[#9a9a9a]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-black/15 pl-5 pr-3 py-1.5 text-[13px] font-[400] text-black placeholder:text-[#9a9a9a] focus:outline-none focus:border-black/40 rounded-none"
            />
          </form>
          <nav className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn('text-[13px] font-[400] transition-colors',
                  pathname === link.href ? 'text-black' : 'text-[#6d6d6d] hover:text-black')}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
