"use client";

import React from "react";
import { Mic, Zap, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { EmergencyResponse, LatencyMetrics } from "@/lib/api";

interface InteractivePipelineProps {
  isLoading: boolean;
  response: EmergencyResponse | null;
  metrics: LatencyMetrics | null;
}

export const InteractivePipeline: React.FC<InteractivePipelineProps> = ({
  isLoading,
  response,
  metrics,
}) => {
  const isMossUsed = response?.retrieval_engine === "moss";
  const isLlmUsed = metrics?.llm_formatting_ms !== null && metrics?.llm_formatting_ms !== undefined;
  const isEmergency = response?.interaction_type === "emergency";
  const isPassed = response?.safety_status === "validated";

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>🔬 Zero-Latency Clinical Pipeline Architecture</span>
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Real-time execution flow from user voice/text to safety-verified guidance
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Pipeline Active...
              </span>
            ) : response ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pipeline Executed in {metrics?.backend_total_ms ?? "0"}ms
              </span>
            ) : (
              <span className="text-zinc-400">Standby (Ready)</span>
            )}
          </span>
        </div>
      </div>

      {/* Visual Step Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {/* Step 1: Input */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isLoading || response
              ? "bg-amber-950/20 border-amber-500/50 shadow-sm shadow-amber-950/50"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              1. User Input
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">0.0ms</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Real-time speech transcript or emergency text query.
          </p>
        </div>

        {/* Step 2: Moss Zero-Latency Retrieval */}
        <div
          className={`p-3 rounded-xl border transition-all relative ${
            isMossUsed
              ? "bg-purple-950/30 border-purple-500/60 shadow-md shadow-purple-950/50"
              : response
              ? "bg-zinc-950/60 border-zinc-800 text-zinc-400"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-purple-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              2. Moss Retrieval
            </span>
            <span className="text-[10px] text-purple-400 font-mono font-bold">
              {metrics?.moss_retrieval_ms !== null && metrics?.moss_retrieval_ms !== undefined
                ? `${metrics.moss_retrieval_ms}ms`
                : "<10ms"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Sub-10ms in-memory vector index scan of approved protocols.
          </p>
        </div>

        {/* Step 3: Safety Gate */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isPassed
              ? "bg-emerald-950/30 border-emerald-500/50 shadow-sm shadow-emerald-950/50"
              : response
              ? "bg-amber-950/20 border-amber-500/50"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              3. Safety Gate
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">10-Point</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Verifies review status, WHO/Red Cross citations, and relevance bounds.
          </p>
        </div>

        {/* Step 4: Symptom Triage */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isEmergency
              ? "bg-rose-950/30 border-rose-500/60 shadow-sm shadow-rose-950/50"
              : response
              ? "bg-sky-950/20 border-sky-500/50"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              4. Symptom Triage
            </span>
            <span className="text-[10px] text-rose-400 font-mono font-bold">
              {isEmergency ? "RED-FLAG" : "Routine"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Non-diagnostic classifier for red flags, escalating severe cases to 112.
          </p>
        </div>

        {/* Step 5: Gemini Formatter */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isLlmUsed
              ? "bg-teal-950/30 border-teal-500/60 shadow-sm shadow-teal-950/50"
              : response
              ? "bg-zinc-950/60 border-zinc-800 text-zinc-400"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              5. Format Gate
            </span>
            <span className="text-[10px] text-teal-400 font-mono">
              {metrics?.llm_formatting_ms ? `${metrics.llm_formatting_ms}ms` : "Zero-Altered"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Strict formatting only with Gemini Flash Lite without clinical edits.
          </p>
        </div>
      </div>
    </div>
  );
};
