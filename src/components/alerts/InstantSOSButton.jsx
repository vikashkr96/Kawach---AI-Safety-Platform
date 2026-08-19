import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Check, Radio, Clock } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { dispatchEmergencyAlert } from '../../services/alertDispatch';

export default function InstantSOSButton() {
  const { triggerSOS, currentLocation, contacts } = useSafety();
  const [triggered, setTriggered] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef(null);

  // 30-second cooldown timer countdown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      timerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTriggered(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [cooldownSeconds]);

  const handleSOS = async () => {
    if (cooldownSeconds > 0) return;

    triggerSOS('Instant Emergency SOS Triggered');
    setTriggered(true);
    setCooldownSeconds(30);

    // Trigger automated Email & AI Call Dispatch in background
    await dispatchEmergencyAlert({
      userName: 'Ananya Sharma',
      userPhone: '+919631412596',
      userEmail: 'vk4845646@gmail.com',
      location: currentLocation,
      reason: 'Instant SOS Button Pressed by User',
      contacts
    });
  };

  const cooldownPercent = Math.max(0, ((30 - cooldownSeconds) / 30) * 100);

  return (
    <div className="relative group">
      {/* Outer Pulse Ripple */}
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${
        triggered ? 'from-emerald-500 to-teal-400 opacity-80' : 'from-rose-600 via-red-500 to-rose-700 opacity-70 animate-pulse'
      } blur-xl group-hover:opacity-100 transition duration-500`} />

      <button
        onClick={handleSOS}
        disabled={cooldownSeconds > 0}
        className={`relative w-full py-5 px-6 rounded-3xl font-black text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-3 shadow-2xl border ${
          cooldownSeconds > 0
            ? 'bg-slate-900 text-slate-400 border-slate-700 cursor-not-allowed opacity-90'
            : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white border-red-400/50 glow-crimson'
        }`}
      >
        {cooldownSeconds > 0 ? (
          <>
            <Clock className="w-6 h-6 animate-spin text-cyan-400" />
            <div className="text-left">
              <span className="text-sm font-black block leading-tight text-white">
                SOS DISPATCHED — COOLDOWN ({cooldownSeconds}s)
              </span>
              <span className="text-[10px] font-bold text-cyan-300 uppercase block opacity-90">
                EMERGENCY CONTACT CASCADE IN PROGRESS
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="p-1.5 rounded-2xl bg-white/10">
              <AlertOctagon className="w-7 h-7 stroke-[2.5] text-white animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-base font-extrabold block leading-tight">EMERGENCY SOS</span>
              <span className="text-[10px] font-bold text-red-200 tracking-normal block opacity-90">
                ONE-TAP DISPATCH TO ALL 3 TRUSTED CONTACTS
              </span>
            </div>
          </>
        )}
      </button>

      {/* 30s Cooldown Progress Bar */}
      {cooldownSeconds > 0 && (
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${cooldownPercent}%` }}
          />
        </div>
      )}

      <p className="text-[11px] text-center text-slate-400 mt-2 font-medium flex items-center justify-center gap-1.5">
        <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        Zero-friction priority alert • 30s cooldown prevents duplicate spamming
      </p>
    </div>
  );
}
