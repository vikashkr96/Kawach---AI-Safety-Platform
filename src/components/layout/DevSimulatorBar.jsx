import React, { useState } from 'react';
import { FastForward, AlertTriangle, Navigation, WifiOff, Mic, ChevronUp, ChevronDown, Sparkles, Sliders } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function DevSimulatorBar() {
  const [isOpen, setIsOpen] = useState(true);
  const {
    activeWalk,
    triggerSOS,
    isOffline,
    setIsOffline,
    simulatedDeviationMeters,
    setSimulatedDeviationMeters,
    performVoiceCheckIn
  } = useSafety();

  const [distressVoiceSample, setDistressVoiceSample] = useState(
    "I'm on Oak Alley... wait, someone is following me closely and I feel scared."
  );
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const handleSimulateDistressVoice = async () => {
    setIsProcessingVoice(true);
    await performVoiceCheckIn(distressVoiceSample);
    setIsProcessingVoice(false);
  };

  const toggleDeviation = () => {
    if (simulatedDeviationMeters > 0) {
      setSimulatedDeviationMeters(0);
    } else {
      setSimulatedDeviationMeters(200); // 200m off path
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="glass-panel border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden glow-cyan">
          {/* Header Toggle Bar */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border-b border-slate-800/80 cursor-pointer text-slate-300 hover:text-white select-none"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Dev Walkthrough Simulator
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">(Fast-test AI & Escalation Triggers)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-2">{isOpen ? 'Hide Controls' : 'Show Controls'}</span>
              {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400" />}
            </div>
          </div>

          {/* Simulator Action Buttons */}
          {isOpen && (
            <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/90">
              {/* 1. SOS Trigger */}
              <button
                onClick={() => triggerSOS('Manual Dev Simulator SOS Test')}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-2xl bg-rose-950/90 border border-rose-700/90 text-rose-300 hover:bg-rose-900 transition-all text-xs font-black shadow-lg"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Test SOS</span>
              </button>

              {/* 2. Route Deviation */}
              <button
                onClick={toggleDeviation}
                className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-2xl border text-xs font-black transition-all ${
                  simulatedDeviationMeters > 0
                    ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{simulatedDeviationMeters > 0 ? 'Reset Path' : 'Deviate 200m'}</span>
              </button>

              {/* 3. Offline Mode */}
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-2xl border text-xs font-black transition-all ${
                  isOffline
                    ? 'bg-purple-950 border-purple-600 text-purple-200 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <WifiOff className="w-4 h-4 text-purple-400" />
                <span>{isOffline ? 'Go Online' : 'Simulate Offline'}</span>
              </button>

              {/* 4. Voice Distress AI Test */}
              <button
                onClick={handleSimulateDistressVoice}
                disabled={isProcessingVoice}
                className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-2xl bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 transition-all text-xs font-black disabled:opacity-50 shadow-lg"
              >
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>{isProcessingVoice ? 'AI Analyzing...' : 'Voice Distress'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
