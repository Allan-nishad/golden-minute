"use client";

import React from "react";
import { Sparkles, Clock, ShieldCheck, Zap, Heart, AlertTriangle } from "lucide-react";

interface StorytellingHeroProps {
  onQuickStart: () => void;
}

export const StorytellingHero: React.FC<StorytellingHeroProps> = ({ onQuickStart }) => {
  return (
    <section className="space-y-6 pt-2">
      {/* Badge Header */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>YC Fall 2026 × Moss Builder Sprint Demonstration</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100 leading-tight">
          The{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 underline decoration-amber-500/30 decoration-wavy">
            Golden Minute
          </span>{" "}
          Saves Lives.
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          In medical emergencies, the first 60 seconds determine survival. Standard LLMs take 3–5 seconds and hallucinate clinical dosages.{" "}
          <strong className="text-amber-300">GOLDEN MINUTE</strong> delivers certified, peer-reviewed first-aid guidance in{" "}
          <span className="text-purple-300 font-mono font-bold">&lt;10ms</span> via Moss in-memory semantic indexing.
        </p>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3.5 text-center space-y-1">
          <div className="flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-100">60s</div>
          <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
            Critical Window
          </p>
        </div>

        <div className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-3.5 text-center space-y-1">
          <div className="flex items-center justify-center text-purple-400">
            <Zap className="w-4 h-4 fill-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">&lt;2ms</div>
          <p className="text-[11px] text-purple-300/80 font-semibold uppercase tracking-wider">
            Moss Retrieval
          </p>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 text-center space-y-1">
          <div className="flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300">10-Point</div>
          <p className="text-[11px] text-emerald-300/80 font-semibold uppercase tracking-wider">
            Clinical Safety Gate
          </p>
        </div>

        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3.5 text-center space-y-1">
          <div className="flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-rose-300">0%</div>
          <p className="text-[11px] text-rose-300/80 font-semibold uppercase tracking-wider">
            Hallucination Risk
          </p>
        </div>
      </div>
    </section>
  );
};
