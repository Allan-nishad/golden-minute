"use strict";
import React from "react";
import { Info } from "lucide-react";

export const SafetyNotice: React.FC = () => {
  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-400 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        <strong className="text-zinc-300">Safety & Prototype Notice:</strong> This application is an educational MVP prototype for real-time emergency protocol retrieval. It is not a medical diagnosis tool, emergency dispatch service, or a replacement for trained healthcare and first-responder personnel.
      </p>
    </div>
  );
};
