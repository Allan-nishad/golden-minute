"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { LatencyMetrics } from "@/lib/api";

interface LatencyBenchmarkerProps {
  metrics: LatencyMetrics | null;
}

export const LatencyBenchmarker: React.FC<LatencyBenchmarkerProps> = ({ metrics }) => {
  const mossMs = metrics?.moss_retrieval_ms ?? 1.2;
  const standardLlmMs = 3200; // Average generative LLM latency in ms
  const speedupFactor = Math.round(standardLlmMs / Math.max(mossMs, 0.5));

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-purple-400" />
            <span>Latency Benchmark vs Conventional Generative LLMs</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Why in-memory semantic retrieval is critical for hands-free voice emergencies
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
          ⚡ {speedupFactor}x Faster
        </span>
      </div>

      {/* Visual Bars Comparison */}
      <div className="space-y-3 pt-1">
        {/* Moss Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              Moss In-Memory Retrieval (GOLDEN MINUTE)
            </span>
            <span className="font-mono text-purple-300 font-bold">{mossMs} ms (Sub-10ms)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(4, (mossMs / 20) * 100))}%` }}
            />
          </div>
        </div>

        {/* Baseline Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-400">Baseline Deterministic Token Engine</span>
            <span className="font-mono text-zinc-300">
              {metrics?.baseline_retrieval_ms ?? 0.8} ms
            </span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(4, ((metrics?.baseline_retrieval_ms ?? 0.8) / 20) * 100)
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Standard LLM Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Standard Cloud LLM Chatbots (ChatGPT / Claude / Generic Agents)
            </span>
            <span className="font-mono text-rose-400 font-bold">~3,200 ms (Danger Delay)</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-rose-600 to-red-500 h-full rounded-full w-full opacity-80" />
          </div>
          <p className="text-[10px] text-rose-300/80 pt-0.5">
            ⚠️ 3–5 seconds of cloud LLM latency in CPR or choking events delays critical bystander intervention.
          </p>
        </div>
      </div>
    </div>
  );
};
