"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, ShieldCheck, AlertTriangle, Activity } from "lucide-react";
import { EmergencyResponse } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";
import { VoiceControls } from "./VoiceControls";

interface GuidanceCardProps {
  data: EmergencyResponse;
  submittedQuery?: string;
  onClear?: () => void;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({
  data,
  submittedQuery,
  onClear,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(data.guidance);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEmergency = data.interaction_type === "emergency" || (data.warning_signs_detected && data.warning_signs_detected.length > 0);
  const isClarification = data.interaction_type === "clarification";
  const isValidated = data.safety_status === "validated";

  const getBorderAndBg = () => {
    if (isEmergency) return "bg-rose-950/30 border-rose-500/50 shadow-rose-950/30";
    if (isClarification) return "bg-amber-950/20 border-amber-500/50 shadow-amber-950/30";
    if (isValidated) return "bg-zinc-900/95 border-emerald-500/40 shadow-emerald-950/20";
    return "bg-zinc-900/95 border-zinc-700/60 shadow-zinc-950/20";
  };

  const getHeaderBadge = () => {
    if (isEmergency) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Emergency Escalation Required
        </span>
      );
    }
    if (isClarification) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Symptom Clarification & Triage
        </span>
      );
    }
    if (isValidated) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Validated Protocol
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
        <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
        Medical Assessment Required
      </span>
    );
  };

  const protocolTitle = data.source.title || (isEmergency ? "Critical Emergency Warning" : isClarification ? "Symptom Assessment & Guidance" : isValidated ? "Approved First-Aid Guidance" : "Safety Guidance Guard");

  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-300 shadow-2xl p-5 sm:p-7 backdrop-blur-md ${getBorderAndBg()}`}
    >
      {/* Submitted Query Display Bar (if available) */}
      {submittedQuery && (
        <div className="mb-4 pb-3 border-b border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-zinc-400 font-semibold shrink-0">Emergency Prompt:</span>
            <span className="text-amber-300 font-medium truncate bg-zinc-950/60 px-2.5 py-1 rounded-md border border-zinc-800">
              "{submittedQuery}"
            </span>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline shrink-0 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          {getHeaderBadge()}
          <StatusBadge type="engine" value={data.retrieval_engine} />
          
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-800 text-amber-400 border border-zinc-700">
            {data.protocol_category.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Read Aloud Voice Trigger */}
          <VoiceControls
            onTranscriptReceived={() => {}}
            textToSpeak={data.guidance}
          />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all"
            title="Copy guidance"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Protocol Content */}
      <div className="py-6 space-y-4">
        {/* Warning Signs Alert Banner (if detected) */}
        {data.warning_signs_detected && data.warning_signs_detected.length > 0 && (
          <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-4 space-y-1.5 text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Critical Red-Flag Warnings Detected:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-200/90 pl-1">
              {data.warning_signs_detected.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-1 ${
              isEmergency
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : isClarification
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : isValidated
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {isEmergency ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isClarification ? (
              <ShieldCheck className="w-6 h-6" />
            ) : isValidated ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-3 w-full">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block mb-0.5">
                {isEmergency ? "Emergency Action Required" : isClarification ? "Non-Emergency Symptom Triage" : isValidated ? "Verified Emergency Protocol" : "Safety Advisory"}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center gap-2">
                <span>{protocolTitle}</span>
              </h3>
            </div>

            <div className="text-zinc-200 text-sm sm:text-base leading-relaxed space-y-2 whitespace-pre-line font-medium bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              {data.guidance}
            </div>
          </div>
        </div>

        {/* Clarifying Questions Box (if present) */}
        {data.clarifying_questions && data.clarifying_questions.length > 0 && (
          <div className="bg-sky-950/40 border border-sky-500/40 rounded-xl p-4 space-y-2 text-xs text-sky-200">
            <div className="font-bold text-sky-300 flex items-center gap-2 text-sm">
              <span>🩺 Essential Clarifying Questions for Safe Assessment:</span>
            </div>
            <p className="text-[11px] text-sky-300/80">
              To evaluate the severity accurately without making assumptions, consider these questions:
            </p>
            <div className="space-y-1.5 pt-1">
              {data.clarifying_questions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-zinc-950/50 p-2.5 rounded-lg border border-sky-800/40">
                  <span className="font-bold text-sky-400 shrink-0">{idx + 1}.</span>
                  <span className="text-zinc-200 font-medium">{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Metadata & Authority Source */}
      <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-zinc-300">Authoritative Source:</span>
          {data.source.url ? (
            <a
              href={data.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>{data.source.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span>{data.source.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span>Reason: <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">{data.validation_reason}</code></span>
        </div>
      </div>
    </div>
  );
};
