'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import Link from 'next/link';

interface GlassNavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  onLoginClick,
  onSignUpClick,
}) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 px-6 py-6 w-full"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-white font-semibold text-lg tracking-tight">RepoScout</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            <Link href="/explore" className="hover:text-white transition-colors duration-300">
              Explore
            </Link>
            <Link href="/issues" className="hover:text-white transition-colors duration-300">
              Issues
            </Link>
            <Link href="/good-first-issues" className="hover:text-white transition-colors duration-300">
              Good First Issues
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSignUpClick}
            className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer"
          >
            Sign Up
          </button>
          <button
            onClick={onLoginClick}
            className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
