import React, { useState } from 'react';
import { Clock, ShieldCheck, Mic, CheckCircle2, AlertOctagon, Navigation, Sparkles, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSafety } from '../../context/SafetyContext';
import VoiceCheckInModal from './VoiceCheckInModal';

export default function ActiveWalkCard() {
  const { activeWalk, arriveSafely, simulatedDeviationMeters } = useSafety();
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  if (!activeWalk || activeWalk.status !== 'active') return null;

  const seconds = activeWalk.secondsRemaining || 0;
  const totalSeconds = (activeWalk.durationMinutes || 15) * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - seconds) / totalSeconds) * 100));

  const minsRemaining = Math.floor(seconds / 60);
  const secsRemaining = seconds % 60;
  const formattedTimer = `${minsRemaining.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;

  const handleArrive = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    arriveSafely();
  };

  return (
    <>
      <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-5 border border-cyan-500/30 relative overflow-hidden glow-cyan">
        {/* Glow Accent Circle */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Safe Walk Protection Active</span>
              </h3>
              <p className="text-xs text-slate-400">Heading to <span className="text-slate-200 font-bold">{activeWalk.destinationName}</span></p>
            </div>
          </div>

          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 shadow-md">
            {activeWalk.riskLevel || 'Low Risk'}
          </span>
        </div>

        {/* Countdown Timer Display */}
        <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Check-in Countdown
            </span>
            <span className="text-xs font-bold text-slate-300">
              ETA: {new Date(activeWalk.expectedArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {formattedTimer}
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              +2m grace period
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Deviation Warning Box (if active) */}
        {simulatedDeviationMeters > 0 && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600/80 flex items-center space-x-3.5 animate-pulse shadow-lg">
            <Navigation className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
                Route Deviation Detected!
              </span>
              <p className="text-xs text-amber-200/90 mt-0.5">
                Location is {simulatedDeviationMeters}m off safe route. Auto-notifying contacts if uncorrected.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Arrived Safely */}
          <button
            onClick={handleArrive}
            className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2.5"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>I HAVE ARRIVED SAFELY</span>
          </button>

          {/* Talk to Check-in */}
          <button
            onClick={() => setShowVoiceModal(true)}
            className="py-3.5 px-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-extrabold text-xs transition-all flex items-center justify-center space-x-2.5 shadow-md"
          >
            <Mic className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>TALK TO CHECK-IN (AI)</span>
          </button>
        </div>
      </div>

      <VoiceCheckInModal isOpen={showVoiceModal} onClose={() => setShowVoiceModal(false)} />
    </>
  );
}
