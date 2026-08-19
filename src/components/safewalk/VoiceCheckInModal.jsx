import React, { useState } from 'react';
import { Mic, Sparkles, AlertOctagon, CheckCircle2, Volume2, ShieldAlert, Radio } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function VoiceCheckInModal({ isOpen, onClose }) {
  const { performVoiceCheckIn, arriveSafely } = useSafety();

  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const samplePresets = [
    {
      label: 'Safe Arrival',
      text: 'I just reached the main avenue entrance, heading inside now. Everything is calm.',
      type: 'safe'
    },
    {
      label: 'Distress Signal',
      text: 'Wait... someone is following me down this dark alley and I feel scared, help.',
      type: 'distress'
    },
    {
      label: 'Uncertain / Unlit',
      text: 'I am near the metro underpass. It is completely pitch black and weird.',
      type: 'uncertain'
    }
  ];

  const handleSubmitVoiceCheckIn = async (textToAnalyze) => {
    const text = textToAnalyze || transcript;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    const result = await performVoiceCheckIn(text);
    setAnalysisResult(result);
    setIsAnalyzing(false);

    if (result.status === 'calm') {
      setTimeout(() => {
        arriveSafely();
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-700/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Voice Check-in Sentinel</h3>
              <p className="text-xs text-slate-400">Gemini AI Distress & Panic Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-center space-x-1.5 h-16">
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-1"></div>
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-2"></div>
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-3"></div>
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-4"></div>
          <div className="w-1.5 bg-cyan-400 rounded-full animate-wave-5"></div>
        </div>

        {/* Voice Input Transcript */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Voice Check-in Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setAnalysisResult(null);
            }}
            placeholder="Speak or type check-in phrase..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          {/* Quick Test Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Quick Test Presets (Click to analyze):
            </span>
            <div className="space-y-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(preset.text);
                    handleSubmitVoiceCheckIn(preset.text);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    preset.type === 'distress'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-200 hover:bg-rose-900/50'
                      : preset.type === 'uncertain'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200 hover:bg-amber-900/50'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200 hover:bg-emerald-900/50'
                  }`}
                >
                  <span className="truncate pr-2">"{preset.text}"</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-950 shrink-0">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Loading State */}
        {isAnalyzing && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-800/50 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-cyan-300">Gemini AI classifying sentiment & panic signals...</p>
          </div>
        )}

        {/* AI Analysis Result */}
        {analysisResult && !isAnalyzing && (
          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            analysisResult.status === 'distressed'
              ? 'bg-rose-950/80 border-rose-600 text-rose-100 shadow-xl'
              : analysisResult.status === 'uncertain'
              ? 'bg-amber-950/80 border-amber-600 text-amber-100'
              : 'bg-emerald-950/80 border-emerald-600 text-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gemini Result: {analysisResult.status}
              </span>
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-950">
                Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-95">
              "{analysisResult.reasoning}"
            </p>
            {analysisResult.status === 'distressed' && (
              <div className="text-xs font-bold bg-rose-900/90 p-2.5 rounded-xl text-white border border-rose-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Distress Flagged! SOS Alert dispatched to contacts.</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={() => handleSubmitVoiceCheckIn()}
            disabled={isAnalyzing || !transcript.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>ANALYZE VOICE CHECK-IN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
