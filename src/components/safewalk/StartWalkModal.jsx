import React, { useState } from 'react';
import { Navigation, Clock, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function StartWalkModal({ isOpen, onClose }) {
  const { planSafeWalk, startWalk } = useSafety();

  const [destination, setDestination] = useState('Central Tech Park');
  const [duration, setDuration] = useState(15);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);

  if (!isOpen) return null;

  const presets = [
    'Central Tech Park',
    'Metro North Station (Gate 3)',
    'University Student Housing',
    'Oak Street Apartment 4B'
  ];

  const handleAnalyzeRoute = async () => {
    setIsAnalyzing(true);
    const { riskData } = await planSafeWalk(destination, duration);
    setRiskAssessment(riskData);
    setIsAnalyzing(false);
  };

  const handleConfirmStart = () => {
    startWalk(destination, duration, riskAssessment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 border border-slate-700/60 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Start Safe Walk Protection</h3>
              <p className="text-xs text-slate-400">Proactive location tracking & countdown sentinel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Destination Name or Location
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setRiskAssessment(null);
              }}
              placeholder="Enter destination..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setDestination(p);
                    setRiskAssessment(null);
                  }}
                  className={`text-[11px] px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                    destination === p
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Expected Arrival Duration</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    duration === mins
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* AI Risk Assessment Display */}
          {isAnalyzing && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/50 text-center space-y-2">
              <Sparkles className="w-7 h-7 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-cyan-300">Gemini AI analyzing route waypoints against community incident reports...</p>
            </div>
          )}

          {riskAssessment && !isAnalyzing && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Gemini Route Risk Rating
                </span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  riskAssessment.riskScore >= 7
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  Score: {riskAssessment.riskScore}/10 ({riskAssessment.riskLevel})
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
                "{riskAssessment.reasoning}"
              </p>

              {/* Alternate Route Recommendation */}
              {riskAssessment.alternateRoute && (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-extrabold text-cyan-300">
                      Safer Alternate Route: {riskAssessment.alternateRoute.name}
                    </span>
                    <p className="text-[11px] text-cyan-200/90 mt-0.5">
                      {riskAssessment.alternateRoute.safetyImprovement} ({riskAssessment.alternateRoute.addedDistance}, {riskAssessment.alternateRoute.addedMinutes})
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {!riskAssessment ? (
            <button
              type="button"
              onClick={handleAnalyzeRoute}
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>EVALUATE ROUTE & RISK WITH GEMINI AI</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmStart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
            >
              <span>START SAFE WALK PROTECTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
