"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  RefreshCw,
  Zap,
  Award,
  Cpu,
} from "lucide-react";
import {
  fetchHealth,
  fetchStatus,
  submitEmergencyQuery,
  EmergencyResponse,
  StatusResponse,
} from "@/lib/api";
import { EmergencyReminder } from "@/components/EmergencyReminder";
import { SafetyNotice } from "@/components/SafetyNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { EmergencyInput } from "@/components/EmergencyInput";
import { GuidanceCard } from "@/components/GuidanceCard";
import { MetricsPanel } from "@/components/MetricsPanel";
import { DebugPanel } from "@/components/DebugPanel";
import { StorytellingHero } from "@/components/StorytellingHero";
import { JudgeEvaluator } from "@/components/JudgeEvaluator";
import { InteractivePipeline } from "@/components/InteractivePipeline";
import { LatencyBenchmarker } from "@/components/LatencyBenchmarker";

type ActiveTab = "copilot" | "judge" | "architecture";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("copilot");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<StatusResponse | null>(null);
  const [response, setResponse] = useState<EmergencyResponse | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const guidanceRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const checkBackend = useCallback(async () => {
    try {
      await fetchHealth();
      const statusData = await fetchStatus();
      setIsConnected(true);
      setSystemStatus(statusData);
      setErrorMessage(null);
    } catch {
      setIsConnected(false);
      setSystemStatus(null);
    }
  }, []);

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, [checkBackend]);

  useEffect(() => {
    if (response && guidanceRef.current) {
      guidanceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const handleEmergencySubmit = async (
    query: string,
    useMoss: boolean,
    useLlm: boolean
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastQuery(query);

    try {
      const data = await submitEmergencyQuery({
        query,
        language: "en",
        use_moss: useMoss,
        use_llm: useLlm,
      });
      setResponse(data);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "The guidance service is currently unreachable. If this is a real emergency, contact emergency services immediately."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunJudgeScenario = (query: string, useMoss: boolean, useLlm: boolean) => {
    handleEmergencySubmit(query, useMoss, useLlm);
  };

  return (
    <main className="min-h-screen bg-[#080C14] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
              <Activity className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-zinc-100">
                  GOLDEN MINUTE
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Sub-10ms Copilot
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Real-Time Voice Emergency Guidance Powered by Moss
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <StatusBadge
              type="connection"
              value={isConnected ? "online" : "offline"}
            />
            <button
              type="button"
              onClick={checkBackend}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Refresh connection status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Storytelling Navigation Switcher */}
        <div className="border-t border-zinc-800/60 bg-zinc-950/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
            <button
              type="button"
              onClick={() => setActiveTab("copilot")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "copilot"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Live Emergency Copilot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("judge")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "judge"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>🏆 Judges' Evaluation Bench (1-Click Stories)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("architecture")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "architecture"
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🔬 Pipeline Architecture & Benchmark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 w-full flex-1">
        {/* Storytelling Hero Section */}
        <StorytellingHero
          onQuickStart={() => {
            setActiveTab("copilot");
            inputRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Persistent India 112 Emergency Banner */}
        <EmergencyReminder customReminder={response?.emergency_reminder} />

        {/* Offline Warning Notice if Backend is Down */}
        {!isConnected && (
          <div className="bg-rose-950/50 border border-rose-600/40 rounded-xl p-4 flex items-start gap-3 text-rose-200 text-sm shadow-xl">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold text-rose-300">
                The guidance service is connecting to the cloud backend.
              </strong>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                If this is a real emergency, do not wait. Dial <strong>112</strong> immediately. The backend container may be warming up from standby.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert if Query Submission Failed */}
        {errorMessage && (
          <div className="bg-amber-950/60 border border-amber-600/40 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90">{errorMessage}</p>
          </div>
        )}

        {/* TAB 1: LIVE EMERGENCY COPILOT */}
        {activeTab === "copilot" && (
          <div ref={inputRef} className="space-y-6">
            <EmergencyInput
              onSubmit={handleEmergencySubmit}
              isLoading={isLoading}
              mossConfigured={systemStatus?.moss_configured ?? false}
              llmConfigured={systemStatus?.llm_configured ?? false}
            />

            {/* Live Interactive Pipeline Stage Tracker */}
            <InteractivePipeline
              isLoading={isLoading}
              response={response}
              metrics={response?.metrics ?? null}
            />
          </div>
        )}

        {/* TAB 2: JUDGES' EVALUATION BENCH */}
        {activeTab === "judge" && (
          <div className="space-y-6">
            <JudgeEvaluator
              onRunScenario={handleRunJudgeScenario}
              isLoading={isLoading}
            />

            {/* Live Interactive Pipeline Stage Tracker */}
            <InteractivePipeline
              isLoading={isLoading}
              response={response}
              metrics={response?.metrics ?? null}
            />
          </div>
        )}

        {/* TAB 3: PIPELINE ARCHITECTURE & BENCHMARKS */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <InteractivePipeline
              isLoading={isLoading}
              response={response}
              metrics={response?.metrics ?? null}
            />
            <LatencyBenchmarker metrics={response?.metrics ?? null} />
          </div>
        )}

        {/* Guidance Result Card (Always visible once query is processed) */}
        {response && (
          <section ref={guidanceRef} className="space-y-6 pt-2 scroll-mt-24">
            <GuidanceCard
              data={response}
              submittedQuery={lastQuery}
              onClear={() => {
                setResponse(null);
                setLastQuery("");
              }}
            />
            <MetricsPanel
              metrics={response.metrics}
              engine={response.retrieval_engine}
            />
            <LatencyBenchmarker metrics={response.metrics} />
            <DebugPanel
              response={response}
              query={lastQuery}
            />
          </section>
        )}

        {/* Educational Prototype Disclaimer Notice */}
        <SafetyNotice />
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-6 bg-zinc-950/70 text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 GOLDEN MINUTE — Safety-First Voice Emergency Guidance Copilot</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Powered by Moss In-Memory Retrieval</span>
            <span>•</span>
            <a href="tel:112" className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold">
              <PhoneCall className="w-3 h-3" />
              <span>India Emergency: 112</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
