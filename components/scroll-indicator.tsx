"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, 10, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      title="Scroll down"
    >
      <ChevronDown className="w-8 h-8 text-cyan-400" />
    </motion.div>
  );
};
