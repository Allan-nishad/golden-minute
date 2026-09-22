"use strict";
import React from "react";
import { ShieldCheck, AlertTriangle, Zap, Server, Cpu } from "lucide-react";

interface StatusBadgeProps {
  type: "safety" | "engine" | "connection";
  value: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  if (type === "safety") {
    if (value === "validated") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          Safety Gate: Validated Protocol
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-3.5 h-3.5" />
        Safety Gate: Deterministic Fallback
      </span>
    );
  }

  if (type === "engine") {
    if (value === "moss") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          Engine: Moss Zero-Latency
        </span>
      );
    }
    if (value === "baseline") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          Engine: Local Baseline
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
        Engine: Fallback Guard
      </span>
    );
  }

  if (type === "connection") {
    const isOnline = value === "online";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isOnline
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
          }`}
        />
        <Server className="w-3 h-3" />
        {isOnline ? "Backend Connected" : "Backend Offline"}
      </span>
    );
  }

  return null;
};
