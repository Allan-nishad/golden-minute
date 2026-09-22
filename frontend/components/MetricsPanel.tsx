"use strict";
import React from "react";
import { Gauge, Clock, Zap, Cpu, Sparkles } from "lucide-react";
import { LatencyMetrics } from "@/lib/api";

interface MetricsPanelProps {
  metrics: LatencyMetrics | null;
  engine: "baseline" | "moss" | "fallback" | string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, engine }) => {
  if (!metrics) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-500 text-center">
        Latency metrics will appear here after your query is processed.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Runtime Latency Telemetry
          </h3>
        </div>
        <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full">
          Measured during this request
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Moss Retrieval (Hero Metric) */}
        <div className="bg-purple-950/40 border border-purple-500/50 rounded-lg p-2.5 shadow-sm shadow-purple-950/50 relative overflow-hidden">
          <div className="flex items-center justify-between text-purple-300 text-[11px] mb-1">
            <span className="flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span>Moss Retrieval</span>
            </span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 py-0.2 rounded font-semibold uppercase">
              Sub-10ms
            </span>
          </div>
          <div className="text-xl font-mono font-black text-purple-200">
            {metrics.moss_retrieval_ms !== null ? (
              <>
                {metrics.moss_retrieval_ms}{" "}
                <span className="text-xs font-semibold text-purple-400">ms</span>
              </>
            ) : (
              <span className="text-xs font-normal text-zinc-500">Unused</span>
            )}
          </div>
        </div>

        {/* Baseline Search Comparison */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>Baseline Search</span>
          </div>
          <div className="text-lg font-mono font-bold text-zinc-100">
            {metrics.baseline_retrieval_ms !== null ? (
              <>
                {metrics.baseline_retrieval_ms}{" "}
                <span className="text-xs font-normal text-zinc-400">ms</span>
              </>
            ) : (
              <span className="text-xs font-normal text-zinc-500">N/A</span>
            )}
          </div>
        </div>

        {/* LLM Formatting */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>LLM Formatter</span>
          </div>
          <div className="text-lg font-mono font-bold text-zinc-100">
            {metrics.llm_formatting_ms !== null ? (
              <>
                {metrics.llm_formatting_ms}{" "}
                <span className="text-xs font-normal text-zinc-400">ms</span>
              </>
            ) : (
              <span className="text-xs font-medium text-zinc-400">Direct Protocol</span>
            )}
          </div>
        </div>

        {/* Total Backend Request */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Total Backend</span>
          </div>
          <div className="text-lg font-mono font-bold text-zinc-100">
            {metrics.backend_total_ms} <span className="text-xs font-normal text-zinc-400">ms</span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>Active Engine: <strong className="text-zinc-300 uppercase">{engine}</strong></span>
        <span>Standard high-precision timer (`perf_counter`)</span>
      </div>
    </div>
  );
};
