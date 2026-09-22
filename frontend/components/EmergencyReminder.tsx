"use strict";
import React from "react";
import { PhoneCall, ShieldAlert } from "lucide-react";

interface EmergencyReminderProps {
  customReminder?: string;
}

export const EmergencyReminder: React.FC<EmergencyReminderProps> = ({ customReminder }) => {
  return (
    <div className="w-full bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-red-950/40 border border-red-500/30 rounded-xl p-4 shadow-md backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                Official Emergency Notice (National Helpline 112)
              </h4>
              <span className="text-[10px] bg-red-500/10 text-red-300 border border-red-500/20 px-1.5 py-0.5 rounded font-mono">
                Persistent Safety Rule
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {customReminder ||
                "If this is a real life-threatening emergency, call emergency services immediately. In India, dial 112. Do not delay professional help while using this prototype."}
            </p>
          </div>
        </div>

        <a
          href="tel:112"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs shadow-md transition-all shrink-0 w-full sm:w-auto text-center"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 112 (India)</span>
        </a>
      </div>
    </div>
  );
};
