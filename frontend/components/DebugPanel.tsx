"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Terminal, CheckCircle, XCircle } from "lucide-react";
import { EmergencyResponse } from "@/lib/api";

interface DebugPanelProps {
  response: EmergencyResponse;
  query: string;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ response, query }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden transition-all text-xs font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-semibold text-zinc-300">Judge / Developer Verification Panel</span>
          <span className="text-[10px] text-purple-400 bg-purple-950/50 border border-purple-800/40 px-1.5 py-0.5 rounded">
            Live Moss Inspection
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 bg-zinc-950 border-t border-zinc-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {/* Input Query */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Submitted Query:</span>
              <span className="text-amber-300 font-medium break-all">"{query}"</span>
            </div>

            {/* Active Engine */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Active Retrieval Engine:</span>
              <span className="text-purple-300 font-bold uppercase">{response.retrieval_engine}</span>
            </div>

            {/* Moss Index */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Moss Index:</span>
              <span className="text-zinc-200">golden-minute-emergency</span>
            </div>

            {/* Retrieved Document ID */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Retrieved Document ID:</span>
              <span className="text-emerald-300 font-bold">{response.source.protocol_id || "None / Fallback"}</span>
            </div>

            {/* Moss Latency */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Moss Retrieval Latency:</span>
              <span className="text-purple-400 font-bold">
                {response.metrics.moss_retrieval_ms !== null ? `${response.metrics.moss_retrieval_ms} ms` : "Unused / Offline"}
              </span>
            </div>

            {/* Baseline Latency */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Baseline Search Latency:</span>
              <span className="text-sky-400 font-bold">
                {response.metrics.baseline_retrieval_ms !== null ? `${response.metrics.baseline_retrieval_ms} ms` : "N/A"}
              </span>
            </div>

            {/* Safety Gate Result */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Safety Gate Status:</span>
              <span className={`font-bold inline-flex items-center gap-1 ${response.safety_status === "validated" ? "text-emerald-400" : "text-amber-400"}`}>
                {response.safety_status === "validated" ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-amber-400" />}
                {response.safety_status.toUpperCase()} ({response.validation_reason})
              </span>
            </div>

            {/* Total Backend Latency */}
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
              <span className="text-zinc-500 block mb-1">Total Backend Latency:</span>
              <span className="text-amber-400 font-bold">{response.metrics.backend_total_ms} ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
