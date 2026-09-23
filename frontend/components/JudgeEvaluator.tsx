"use client";

import React from "react";
import { Play, Zap, ShieldAlert, HeartPulse, ShieldCheck, CheckCircle, Info } from "lucide-react";

interface JudgeScenario {
  id: string;
  title: string;
  categoryBadge: string;
  badgeColor: string;
  query: string;
  useMoss: boolean;
  useLlm: boolean;
  expectedOutcome: string;
  whatToJudge: string;
}

const SCENARIOS: JudgeScenario[] = [
  {
    id: "scenario-choking",
    title: "Scenario 1: Life-Threatening Choking (Zero-Latency)",
    categoryBadge: "Sub-2ms Moss Retrieval",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    query: "Someone is choking and cannot breathe or speak",
    useMoss: true,
    useLlm: false,
    expectedOutcome: "Immediate British Red Cross Heimlich protocol retrieved in <2ms with zero hallucination.",
    whatToJudge: "Check the Moss Retrieval latency in the telemetry box (<2ms) and verified source citation.",
  },
  {
    id: "scenario-redflag",
    title: "Scenario 2: Red-Flag Clinical Escalation (Emergency)",
    categoryBadge: "112 Urgent Escalation",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    query: "High fever with sudden severe confusion and stiff neck",
    useMoss: true,
    useLlm: false,
    expectedOutcome: "Red-Flag emergency detected. Non-diagnostic escalation directs user to call 112 immediately.",
    whatToJudge: "Notice how the system rejects home remedy delay and surfaces high-priority emergency dispatch warnings.",
  },
  {
    id: "scenario-bleeding",
    title: "Scenario 3: Severe Arterial Trauma (Peer-Reviewed)",
    categoryBadge: "Trauma Protocol",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    query: "Deep arm wound with heavy spurting blood",
    useMoss: true,
    useLlm: true,
    expectedOutcome: "Clean, calming step-by-step pressure protocol formatted with Gemini without altering medical facts.",
    whatToJudge: "Click 'Read Aloud' to test hands-free audio voice narration for first responders.",
  },
  {
    id: "scenario-defense",
    title: "Scenario 4: Safety Gate Defense (Anti-Hallucination)",
    categoryBadge: "Safety Gate Rejection",
    badgeColor: "bg-zinc-800 text-zinc-300 border-zinc-700",
    query: "How do I trade cryptocurrency on leverage?",
    useMoss: true,
    useLlm: false,
    expectedOutcome: "Blocked by 10-Point Safety Gate. Rejects non-emergency queries safely.",
    whatToJudge: "Observe how off-domain queries are rejected with reason code 'out_of_domain' instead of hallucinating.",
  },
];

interface JudgeEvaluatorProps {
  onRunScenario: (query: string, useMoss: boolean, useLlm: boolean) => void;
  isLoading: boolean;
}

export const JudgeEvaluator: React.FC<JudgeEvaluatorProps> = ({
  onRunScenario,
  isLoading,
}) => {
  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Judges & Evaluators Bench
            </span>
            <h3 className="text-base sm:text-lg font-black text-zinc-100">
              Interactive Storyline & Stress Tests
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Click any scenario below to execute the live end-to-end pipeline and test each core architectural claim.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg shrink-0">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>1-Click Live Test</span>
        </div>
      </div>

      {/* 4 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map((sc, index) => (
          <div
            key={sc.id}
            className="group bg-zinc-950/80 hover:bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/50 rounded-xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-400">Step {index + 1}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                  {sc.categoryBadge}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                {sc.title}
              </h4>

              <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg text-xs font-mono text-amber-300">
                "{sc.query}"
              </div>

              <div className="space-y-1 text-xs text-zinc-400">
                <p>
                  <strong className="text-zinc-300">Expected:</strong> {sc.expectedOutcome}
                </p>
                <p className="text-[11px] text-zinc-500 flex items-start gap-1 pt-1">
                  <Info className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-400">Judge Insight:</strong> {sc.whatToJudge}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRunScenario(sc.query, sc.useMoss, sc.useLlm)}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold transition-all border border-zinc-700 hover:border-amber-400 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Scenario {index + 1}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
