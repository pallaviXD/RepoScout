'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TypingText } from './TypingText';

export const HeroContent: React.FC = () => {
  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-10">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-2"
        >
          SCOUT YOUR NEXT OPEN-SOURCE CONTRIBUTION
        </motion.p>

        {/* Heading with Typewriter Effect */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] max-w-4xl"
        >
          <span className="bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
            Discover repositories and issues that match your{' '}
          </span>
          <br className="hidden md:block" />
          <TypingText
            texts={['skills.', 'experience.', 'interests.', 'passion.']}
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          />
        </motion.h1>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center pt-2"
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-10 py-3.5 text-[15px] font-medium border border-white/20 rounded-full bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_24px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Browse Good First Issues Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/good-first-issues"
            className="text-white/80 hover:text-white transition-colors duration-300 text-[13px] font-medium tracking-wide border-b border-white/20 pb-0.5 hover:border-white"
          >
            Browse Good First Issues →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

