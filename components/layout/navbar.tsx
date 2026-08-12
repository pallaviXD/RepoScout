'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, Github, LogOut, Menu, X, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
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
    { name: 'Dashboard',        href: '/dashboard' },
    { name: 'Analytics',        href: '/dashboard/analytics' },
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
      <div className="max-w-[1078px] mx-auto px-8 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'font-sans text-[15px] font-semibold tracking-[-0.01em] leading-none shrink-0',
            'transition-all duration-500',
            isTransparent ? 'text-white' : 'text-black'
          )}
        >
          RepoScout
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
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
                    ? (isTransparent ? 'text-white' : 'text-black')
                    : (isTransparent ? 'text-white/60 hover:text-white' : 'text-[#6d6d6d] hover:text-black')
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: search + auth */}
        <div className="hidden sm:flex items-center gap-5">
          {/* Inline search */}
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
                'w-[130px] bg-transparent border-0 border-b pl-5 pr-2 py-1',
                'text-[12px] font-[400] placeholder:opacity-50',
                'focus:outline-none focus:w-[190px]',
                'transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-none',
                isTransparent
                  ? 'border-white/25 text-white placeholder:text-white focus:border-white/60'
                  : 'border-black/15 text-black placeholder:text-black focus:border-black/40'
              )}
            />
          </form>

          {status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard/saved">
                <button title="Saved Items" className={cn(
                  'transition-all duration-500 p-0.5',
                  isTransparent ? 'text-white/50 hover:text-white' : 'text-[#9a9a9a] hover:text-black'
                )}>
                  <Bookmark className="w-[14px] h-[14px]" />
                </button>
              </Link>
              <Link href={`/profile/${(session.user as any).username || 'user'}`}>
                <div className="flex items-center gap-2 cursor-pointer">
                  {session.user.image ? (
                    <img src={session.user.image} alt="Avatar"
                      className={cn('w-[26px] h-[26px] rounded-full border',
                        isTransparent ? 'border-white/30' : 'border-black/15')} />
                  ) : (
                    <div className={cn('w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-[500] border',
                      isTransparent ? 'bg-white/10 border-white/25 text-white' : 'bg-black/5 border-black/10 text-black')}>
                      {session.user.name?.[0] || 'U'}
                    </div>
                  )}
                  <span className={cn('text-[12px] font-[400] max-w-[80px] truncate transition-colors duration-500',
                    isTransparent ? 'text-white/80' : 'text-black')}>
                    {(session.user as any).username || session.user.name}
                  </span>
                </div>
              </Link>
              <button onClick={() => signOut()} title="Sign Out"
                className={cn('transition-colors duration-500',
                  isTransparent ? 'text-white/40 hover:text-white' : 'text-[#9a9a9a] hover:text-black')}>
                <LogOut className="w-[13px] h-[13px]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/auth/signin')}
              className={cn(
                'flex items-center gap-2 text-[12px] font-[400] leading-none',
                'px-[20px] py-[9px] rounded-full border',
                'transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                isTransparent
                  ? 'border-white/35 text-white hover:border-white/70 hover:bg-white/10'
                  : 'border-black/25 text-black hover:border-black hover:bg-transparent'
              )}
            >
              <Github className="w-[13px] h-[13px]" />
              Sign in
            </button>
          )}
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
          <div className="pt-4 border-t border-black/8">
            {status === 'authenticated' ? (
              <button onClick={() => signOut()}
                className="text-[12px] font-[400] text-[#6d6d6d] hover:text-black flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            ) : (
              <button onClick={() => router.push('/auth/signin')}
                className="flex items-center gap-2 text-[12px] font-[400] text-black border border-black/25 rounded-full px-5 py-2 hover:bg-black/3">
                <Github className="w-[13px] h-[13px]" /> Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
