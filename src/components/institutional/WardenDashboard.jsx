import React from 'react';
import { Building2, ShieldCheck, AlertOctagon, Users, MapPin, Eye, Radio, Sparkles } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import MapView from '../map/MapView';

export default function WardenDashboard() {
  const { activeWalk, alerts, riskZones } = useSafety();

  const totalWalksToday = 14;
  const activeWalksNow = activeWalk && activeWalk.status === 'active' ? 1 : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800/40 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400 shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Campus Security Warden Command Center</span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                Security Desk Role
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Monitoring University Housing, Hostel District & Student Commutes
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-200 font-bold">Jurisdiction: Central Campus & Perimeter</span>
        </div>
      </div>

      {/* KPI Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1 glass-card-hover">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Active Safe Walks
          </span>
          <div className="text-3xl font-black text-white">{activeWalksNow}</div>
          <p className="text-[11px] text-slate-500 font-medium">Live student commutes</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1 glass-card-hover">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Safe Check-ins
          </span>
          <div className="text-3xl font-black text-white">{totalWalksToday}</div>
          <p className="text-[11px] text-slate-500 font-medium">Completed today</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1 glass-card-hover">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            SOS / Deviation
          </span>
          <div className="text-3xl font-black text-white">{alerts.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Escalated alerts</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1 glass-card-hover">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Risk Zones
          </span>
          <div className="text-3xl font-black text-white">{riskZones.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Clustered hotspots</p>
        </div>
      </div>

      {/* Main Grid: Live Map + AI Risk Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Warden Live Monitoring Map */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Jurisdiction Live Monitoring Map</span>
          </h3>
          <div className="h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <MapView />
          </div>
        </div>

        {/* Right Col: AI Clustered Risk Zones */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Gemini AI Risk Zone Advisories</span>
          </h3>

          <div className="space-y-3">
            {riskZones.map((rz, idx) => (
              <div key={rz.id || idx} className="glass-card rounded-2xl p-4 space-y-2 border border-purple-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-300 truncate">{rz.title}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {rz.incidentCount} reports
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{rz.summary}</p>
                <div className="text-[11px] font-bold text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  Advisory: {rz.advisory}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
