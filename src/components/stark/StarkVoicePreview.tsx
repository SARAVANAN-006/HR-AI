import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Radio, Volume2, Sparkles } from 'lucide-react';

interface StarkVoicePreviewProps {
  audioLevel: number;
  isListening: boolean;
  isMicMuted: boolean;
  interimTranscript: string;
  speechTranscript: string;
  onToggleListening: () => void;
  onToggleMic: () => void;
  onClearTranscript: () => void;
  className?: string;
}

export const StarkVoicePreview: React.FC<StarkVoicePreviewProps> = ({
  audioLevel,
  isListening,
  isMicMuted,
  interimTranscript,
  speechTranscript,
  onToggleListening,
  onToggleMic,
  onClearTranscript,
  className = ''
}) => {
  const [hasVoiceRecognition, setHasVoiceRecognition] = useState<boolean>(true);

  useEffect(() => {
    const supported =
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window ||
      Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setHasVoiceRecognition(supported);
  }, []);

  // Multiplier profiles for the 24 frequency bars to create realistic equalizer curve
  const barMultipliers = [
    0.35, 0.5, 0.7, 0.9, 1.15, 1.3, 1.25, 1.1, 0.95, 0.85, 0.9, 1.1,
    1.2, 1.35, 1.2, 1.05, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35
  ];

  const isVoiceActive = audioLevel > 8 && !isMicMuted;

  return (
    <div
      className={`rounded-2xl border border-cyan-500/30 bg-zinc-950/95 p-4 space-y-3.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] relative overflow-hidden select-none ${className}`}
    >
      {/* Subtle background glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-opacity duration-300 ${
          isVoiceActive ? 'bg-emerald-500/15 opacity-100' : 'bg-cyan-500/10 opacity-50'
        }`}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 rounded-lg border transition ${
              isVoiceActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : isListening
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            <Radio size={14} className={isListening ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <span>LIVE VOICE PREVIEW & STT ENGINE</span>
              {isVoiceActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </h4>
            <p className="text-[10px] font-mono text-zinc-400">
              {isMicMuted
                ? 'Microphone hardware muted'
                : isVoiceActive
                ? 'Voice frequency captured • Transcribing speech'
                : isListening
                ? 'Microphone armed • Awaiting speech'
                : 'Microphone on standby'}
            </p>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center space-x-2">
          <span
            className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold border transition ${
              isMicMuted
                ? 'bg-red-500/15 border-red-500/30 text-red-400'
                : isVoiceActive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : isListening
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            {isMicMuted
              ? 'MIC MUTED'
              : isVoiceActive
              ? 'VOICE DETECTED'
              : isListening
              ? 'LISTENING'
              : 'IDLE'}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full font-mono text-[9px] border ${
              hasVoiceRecognition
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            {hasVoiceRecognition ? 'STT ACTIVE' : 'TEXT ONLY'}
          </span>
        </div>
      </div>

      {/* 24-Bar Dynamic Audio Equalizer Waveform */}
      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-1">
          <span className="flex items-center gap-1">
            <Volume2 size={12} className={isVoiceActive ? 'text-emerald-400' : 'text-zinc-500'} />
            <span>Audio Waveform Spectrum</span>
          </span>
          <span className="font-bold text-zinc-300">
            {isMicMuted ? '0 dB' : `${audioLevel}% Input VU`}
          </span>
        </div>

        {/* The Animated Waveform Bars */}
        <div className="h-10 flex items-end justify-between gap-1 px-1 pt-1">
          {barMultipliers.map((mult, idx) => {
            // Calculate dynamic height based on audio level and multiplier
            let targetHeight = 4;
            if (!isMicMuted && isListening) {
              if (audioLevel > 5) {
                targetHeight = Math.min(
                  38,
                  Math.max(4, Math.round((audioLevel / 100) * 36 * mult + 4))
                );
              } else {
                // Subtle gentle ambient ripple when listening but silent
                targetHeight = 4 + (idx % 3) * 2;
              }
            }

            // Color gradient shifts from cyan to emerald to amber at high peak
            const barBg =
              isMicMuted
                ? '#52525b'
                : targetHeight > 28
                ? '#f59e0b'
                : targetHeight > 14
                ? '#10b981'
                : '#06b6d4';

            return (
              <div
                key={idx}
                className="flex-1 rounded-full transition-all duration-75"
                style={{
                  height: `${targetHeight}px`,
                  backgroundColor: barBg,
                  boxShadow:
                    targetHeight > 16 && !isMicMuted
                      ? `0 0 8px ${barBg}`
                      : 'none'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Real-time Spoken Words Live Preview Banner */}
      <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5 font-bold uppercase tracking-wide">
            <Sparkles size={11} className={interimTranscript ? 'text-amber-400 animate-spin' : 'text-cyan-400'} />
            <span>Live Spoken Words Stream:</span>
          </span>
          {interimTranscript && (
            <span className="text-amber-400 font-bold animate-pulse text-[9px]">
              Transcribing live...
            </span>
          )}
        </div>

        {/* Live words display box */}
        <div className="min-h-[38px] flex items-center text-xs font-mono text-zinc-200">
          {interimTranscript ? (
            <p className="text-amber-300 font-medium italic drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]">
              "{interimTranscript}"
              <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse align-middle" />
            </p>
          ) : speechTranscript ? (
            <p className="text-zinc-300 line-clamp-2">
              <span className="text-zinc-500">Latest: </span>
              "{speechTranscript.slice(-120)}"
            </p>
          ) : (
            <p className="text-zinc-500 text-[11px] italic">
              Speak into your microphone. Words will appear here in real-time as you formulate your response.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Interactive Controls */}
      <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* Toggle Listening Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition ${
              isListening
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
            }`}
          >
            {isListening ? <MicOff size={13} /> : <Mic size={13} />}
            <span>{isListening ? 'Pause Voice' : 'Start Voice'}</span>
          </button>

          {/* Toggle Mic Hardware Button */}
          <button
            type="button"
            onClick={onToggleMic}
            className={`px-2.5 py-1.5 rounded-xl border transition ${
              isMicMuted
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMicMuted ? <MicOff size={13} /> : <Mic size={13} />}
          </button>
        </div>

        {/* Clear Transcript Button */}
        {(speechTranscript || interimTranscript) && (
          <button
            type="button"
            onClick={onClearTranscript}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-900 transition"
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
};
