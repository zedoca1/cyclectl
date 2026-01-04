"use client";

import Link from 'next/link';
import { Rocket, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnimatedHero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
        className="flex items-center gap-4 mb-4"
      >
        <Rocket className="w-12 h-12 text-cyan-400" />
      </motion.div>
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.4 }}
        className="text-5xl md:text-6xl font-bold font-mono text-cyan-400 tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
      >
        CycleCTL
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.6 }}
        className="mt-4 text-xl md:text-2xl font-mono text-cyan-500/80 max-w-2xl"
      >
        Control the cycle. Ship the outcome.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.8 }}
        className="mt-8 flex gap-4"
      >
        <Link href="/projects">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-lg font-bold shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-cyan-400 transition-all">
            Launch App
          </button>
        </Link>
        <a
          href="https://github.com/them3chanik/cyclectl"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg border border-cyan-500/30 text-cyan-400 font-mono text-lg font-bold hover:bg-cyan-500/10 transition-all flex items-center gap-2"
        >
          <Github className="w-5 h-5" />
          View on GitHub
        </a>
      </motion.div>
    </div>
  );
};