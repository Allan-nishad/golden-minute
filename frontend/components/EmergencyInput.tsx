"use client";

import React, { useState } from "react";
import { Send, X, Loader2, Sparkles, Zap } from "lucide-react";
import { VoiceControls } from "./VoiceControls";

interface EmergencyInputProps {
  onSubmit: (query: string, useMoss: boolean, useLlm: boolean) => void;
  isLoading: boolean;
  mossConfigured: boolean;
  llmConfigured: boolean;
}

const EXAMPLE_PROMPTS = [
  "Someone is choking",
  "There is severe bleeding",
  "Someone is having a seizure",
  "Someone is showing signs of a stroke",
  "Severe allergic reaction / anaphylaxis",
  "Someone is unconscious",
  "There is a burn",
  "Breathing emergency / asthma attack",
];

export const EmergencyInput: React.FC<EmergencyInputProps> = ({
  onSubmit,
  isLoading,
  mossConfigured,
  llmConfigured,
}) => {
  const [query, setQuery] = useState("");
  const [useMoss, setUseMoss] = useState(true);
  const [useLlm, setUseLlm] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed, useMoss, useLlm);
  };

  const handleSelectExample = (example: string) => {
    setQuery(example);
    onSubmit(example, useMoss, useLlm);
  };

  const handleTranscript = (transcript: string) => {
    setQuery(transcript);
    onSubmit(transcript, useMoss, useLlm);
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="emergency-query-input" className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Describe Emergency Situation
          </label>

          <VoiceControls
            onTranscriptReceived={handleTranscript}
            isProcessing={isLoading}
          />
        </div>

        {/* Input Text Box */}
        <div className="relative">
          <textarea
            id="emergency-query-input"
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="e.g. Someone is choking, can't breathe, or bleeding heavily..."
            className="w-full bg-zinc-950/80 border border-zinc-700/80 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base resize-none transition-all outline-none"
            disabled={isLoading}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Advanced Feature Toggles (Moss & LLM) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/60 text-xs">
          <div className="flex items-center gap-4 flex-wrap text-zinc-400">
            {/* Moss Retrieval Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useMoss}
                onChange={(e) => setUseMoss(e.target.checked)}
                className="w-3.5 h-3.5 accent-purple-500 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                <span>Enable Moss Retrieval</span>
                {!mossConfigured && (
                  <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    (SDK fallback)
                  </span>
                )}
              </span>
            </label>

            {/* LLM Formatting Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useLlm}
                onChange={(e) => setUseLlm(e.target.checked)}
                className="w-3.5 h-3.5 accent-teal-500 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>LLM Format Gate</span>
                {!llmConfigured && (
                  <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    (Disabled by default)
                  </span>
                )}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Retrieving Guidance...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Get Protocol Guidance</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Example Emergency Prompts */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            Quick Emergency Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSelectExample(prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-300 hover:text-white text-xs border border-zinc-700/60 transition-all active:scale-95 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
