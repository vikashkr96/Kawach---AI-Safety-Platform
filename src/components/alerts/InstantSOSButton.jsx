import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Check, Radio, Clock, Phone, MessageSquare } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';
import { dispatchEmergencyAlert } from '../../services/alertDispatch';

export default function InstantSOSButton() {
  const { triggerSOS, currentLocation, contacts } = useSafety();
  const { activeProfile } = useAuth();

  const [triggered, setTriggered] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef(null);

  // Primary recipient phone for direct tel/sms fallbacks
  const primaryPhone = contacts.length > 0 ? contacts[0].phone : '+919631412596';
  const locationLink = `https://maps.google.com/?q=${currentLocation.lat.toFixed(4)},${currentLocation.lng.toFixed(4)}`;

  // 30-second cooldown timer
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

    triggerSOS(`Instant SOS Triggered by ${activeProfile?.name || 'Traveler'}`);
    setTriggered(true);
    setCooldownSeconds(30);

    // Background alert dispatch
    await dispatchEmergencyAlert({
      userName: activeProfile?.name || 'Vikash Kumar',
      userPhone: activeProfile?.phone || '+91 9631412596',
      userEmail: activeProfile?.email || 'vk4845646@gmail.com',
      location: currentLocation,
      reason: 'Instant SOS Button Pressed by User',
      contacts
    });
  };

  const cooldownPercent = Math.max(0, ((30 - cooldownSeconds) / 30) * 100);

  return (
    <div className="relative group space-y-3">
      {/* Outer Pulse Glow Ring */}
      <div className={`absolute -inset-1.5 rounded-[32px] bg-gradient-to-r ${
        triggered ? 'from-emerald-500 to-teal-400 opacity-80' : 'from-rose-600 via-red-500 to-rose-700 opacity-70 animate-pulse'
      } blur-xl group-hover:opacity-100 transition duration-500`} />

      {/* Main SOS Button (Thumb-zone reachable) */}
      <button
        onClick={handleSOS}
        disabled={cooldownSeconds > 0}
        className={`relative w-full py-5 px-6 rounded-[28px] font-black text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-3 shadow-2xl border ${
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
                EMERGENCY CASCADE IN PROGRESS
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
                ONE-TAP DISPATCH TO ALL TRUSTED CONTACTS
              </span>
            </div>
          </>
        )}
      </button>

      {/* 30s Cooldown Progress Bar */}
      {cooldownSeconds > 0 && (
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${cooldownPercent}%` }}
          />
        </div>
      )}

      {/* Direct Device Dial & SMS Fallback Buttons (Zero Backend Requirement) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${primaryPhone}`}
          className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all"
        >
          <Phone className="w-3.5 h-3.5 text-rose-400" />
          <span>Direct Phone Dial</span>
        </a>

        <a
          href={`sms:${primaryPhone}?body=${encodeURIComponent(`🚨 EMERGENCY SOS from ${activeProfile?.name || 'Traveler'}: I need help! Location: ${locationLink}`)}`}
          className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-[11px] font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Direct SMS Text</span>
        </a>
      </div>
    </div>
  );
}
