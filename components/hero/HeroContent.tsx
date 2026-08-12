'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface HeroContentProps {
  onPlayVideoDemo?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ onPlayVideoDemo }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  const initialTargetText = 'Get Early Access to RepoScout';
  const submittedTargetText = 'You Will Receive Notifications By Email';

  // Typewriter effect logic
  useEffect(() => {
    if (!isFormOpen) {
      setPlaceholderText('');
      return;
    }

    const targetText = isSubmitted ? submittedTargetText : initialTargetText;
    setPlaceholderText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setPlaceholderText(targetText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isFormOpen, isSubmitted]);

  // Reset logic after submission (4 seconds)
  useEffect(() => {
    if (!isSubmitted) return;

    const timer = setTimeout(() => {
      setIsSubmitted(false);
      setIsFormOpen(false);
      setEmail('');
      setPlaceholderText('');
    }, 4000);

    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !isSubmitted) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
          >
            SCOUT YOUR NEXT OPEN-SOURCE CONTRIBUTION
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          >
            Discover repositories and issues that match your skills <br className="hidden md:block" /> and experience
          </motion.h1>

          {/* CTA Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="min-h-[50px] mt-2 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {!isFormOpen ? (
                <motion.a
                  href="/explore"
                  key="button-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer inline-block"
                >
                  Start Exploring
                </motion.a>
              ) : (
                <motion.form
                  key="form-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
                >
                  <input
                    type="email"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isSubmitted}
                    className="w-full bg-transparent text-white placeholder-white/45 outline-none text-[13px] font-normal"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-80"
                  >
                    {isSubmitted ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Learn More Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="/good-first-issues"
            className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide cursor-pointer bg-transparent border-0"
          >
            Browse Good First Issues →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
