"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Square, AlertTriangle } from "lucide-react";

interface VoiceControlsProps {
  onTranscriptReceived: (transcript: string) => void;
  textToSpeak?: string;
  isProcessing?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onTranscriptReceived,
  textToSpeak,
  isProcessing = false,
}) => {
  // Speech-to-text states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Text-to-speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onTranscriptReceived(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            setVoiceError("Microphone permission was denied. Please allow microphone access.");
          } else if (event.error === "no-speech") {
            setVoiceError("No speech detected. Please speak clearly into the microphone.");
          } else {
            setVoiceError(`Voice recognition issue (${event.error}). Please type your query.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }

      // Check Speech Synthesis support
      if (!("speechSynthesis" in window)) {
        setTtsSupported(false);
      }
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onTranscriptReceived]);

  const toggleListening = () => {
    if (!speechSupported) {
      setVoiceError("Voice input is not supported in this browser. Please use text input.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    } else {
      setVoiceError(null);
      try {
        recognitionRef.current?.start();
      } catch (err: any) {
        // Recognition might already be running
        setVoiceError("Failed to start voice recognition. Please try again.");
      }
    }
  };

  const handleSpeak = () => {
    if (!ttsSupported || !textToSpeak) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      // Clean markdown numbered formatting for spoken narration
      const cleanText = textToSpeak
        .replace(/\n/g, ". ")
        .replace(/\*\*/g, "")
        .replace(/#/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Calm, clear, measured emergency speed
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Voice Input Trigger Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isProcessing}
          aria-label={isListening ? "Stop listening" : "Start voice emergency input"}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
            isListening
              ? "bg-red-600 text-white border-red-500 animate-pulse shadow-red-500/20"
              : "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:border-zinc-600"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 text-white" />
              <span>Listening... Tap to stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Voice Input</span>
            </>
          )}
        </button>

        {/* Text-to-Speech Button */}
        {textToSpeak && ttsSupported && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSpeak}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
                isSpeaking
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:border-zinc-600"
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : "text-emerald-400"}`} />
              <span>{isSpeaking ? "Speaking Protocol..." : "Read Aloud"}</span>
            </button>

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Voice Error notice if any */}
      {voiceError && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-2 rounded-md">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Unsupported browser fallback notice */}
      {!speechSupported && (
        <p className="text-[11px] text-zinc-500">
          Voice input is not supported in this browser. Please use the text field below.
        </p>
      )}
    </div>
  );
};
