import React from 'react';
import { AlertTriangle, Phone, ExternalLink, ShieldCheck, Clock, MapPin, CheckCircle2, User, Radio } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function TrustedContactDashboard() {
  const { alerts, contacts, offlineSmsQueue } = useSafety();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700/60 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Trusted Contact Live Feed</span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Live Sentinel
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time emergency monitoring feed for Ananya Sharma's safety circle
            </p>
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200 font-bold">User: Ananya Sharma</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400 font-mono">+1 (555) 987-6543</span>
        </div>
      </div>

      {/* Offline SMS Queue Alert (if active) */}
      {offlineSmsQueue.length > 0 && (
        <div className="p-5 rounded-3xl bg-purple-950/80 border border-purple-700 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Offline SMS Queue Active ({offlineSmsQueue.length} alert queued)
            </span>
            <span className="text-[11px] font-bold bg-purple-900 text-purple-200 px-3 py-1 rounded-full">
              Simulated SMS Gateway
            </span>
          </div>
          <p className="text-xs text-purple-200/90 leading-relaxed">
            Device went offline during emergency alert. Alerts are queued and transmitting via SMS protocol to primary contact (+1-555-234-5678).
          </p>
        </div>
      )}

      {/* Real-time Alert Feed */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Active Alert Feed ({alerts.length})</span>
          <span className="text-slate-500 font-medium">Real-time Firestore stream</span>
        </h3>

        {alerts.length === 0 ? (
          <div className="glass-card border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-white">All Quiet & Safe</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No active emergency alerts or missed check-ins recorded. System sentinel is watching.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.type === 'SOS' || alert.type === 'MISSED_CHECKIN';
            const isSafe = alert.type === 'SAFE_ARRIVAL';

            return (
              <div
                key={alert.id}
                className={`rounded-3xl p-6 border shadow-2xl transition-all space-y-4 ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-600/80 text-rose-100 glow-crimson'
                    : isSafe
                    ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-100'
                    : 'bg-amber-950/30 border-amber-700/60 text-amber-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isCritical ? (
                      <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-bounce shadow-lg">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                    ) : isSafe ? (
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-base font-black tracking-wide uppercase">
                        {alert.type.replace('_', ' ')} ALERT
                      </h4>
                      <p className="text-xs opacity-80 font-medium">{alert.timestamp} • User: {alert.userName}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${
                    isCritical
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : isSafe
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {alert.severity || 'HIGH'}
                  </span>
                </div>

                {/* Content */}
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold leading-relaxed text-slate-100">
                    "{alert.reason || alert.message}"
                  </p>

                  {alert.location && (
                    <div className="flex items-center justify-between text-xs text-cyan-400 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center gap-1.5 font-mono">
                        <MapPin className="w-4 h-4" />
                        Lat: {alert.location.lat.toFixed(4)}, Lng: {alert.location.lng.toFixed(4)}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${alert.location.lat},${alert.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold underline flex items-center gap-1 hover:text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60"
                      >
                        <span>Open Live Map</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Notification Cascade */}
                {alert.contactsNotified && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">
                      Notified Trusted Contacts Cascade:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {contacts.map((c, i) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-slate-200 block truncate">{c.name}</span>
                            <span className="text-[10px] text-slate-400">{c.relationship}</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-400 uppercase">
                            {i === 0 ? 'Urgent Call' : 'Notified'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isCritical && (
                  <div className="flex space-x-3 pt-2">
                    <a
                      href={`tel:${alert.userPhone || '+15559876543'}`}
                      className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all text-center flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30"
                    >
                      <Phone className="w-4 h-4" />
                      <span>CALL USER NOW</span>
                    </a>
                    <button
                      onClick={() => alert('Emergency dispatch notification issued to local authorities.')}
                      className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all text-center"
                    >
                      Dispatch Emergency Services
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
