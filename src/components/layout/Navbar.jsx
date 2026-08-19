import React, { useState } from 'react';
import { Shield, Users, Building2, MapPin, Key, Wifi, WifiOff, Smartphone, Monitor, BatteryCharging, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { CITY_PRESETS } from '../../data/seedIncidents';
import { getGeminiApiKey, setGeminiApiKey } from '../../services/gemini';

export default function Navbar({ activeTab, setActiveTab, isMobileFrame, setIsMobileFrame }) {
  const { currentCity, changeCity, isOffline } = useSafety();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());

  const isEnvKeyConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
  };

  const navItems = [
    { id: 'walk', label: 'Safe Walk', icon: Shield, badge: null },
    { id: 'contacts', label: 'Trusted Feed', icon: Users, badge: 'Live' },
    { id: 'warden', label: 'Warden Desk', icon: Building2, badge: 'Admin' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#030712]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('walk')}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 rounded-2xl bg-slate-950 border border-cyan-400/30 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  KAVACH
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-sm">
                  कवच AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Personal Safety Companion</p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities & Status Bar */}
          <div className="flex items-center space-x-2.5">
            {/* City Preset Selector */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={currentCity.name}
                onChange={(e) => {
                  const selected = CITY_PRESETS.find(c => c.name === e.target.value);
                  if (selected) changeCity(selected);
                }}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {CITY_PRESETS.map((city) => (
                  <option key={city.name} value={city.name} className="bg-slate-950 text-slate-200">
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Offline Status Indicator */}
            {isOffline ? (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-bold animate-pulse shadow-lg">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline (SMS Active)</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live GPS</span>
              </div>
            )}

            {/* Mobile Preview Switcher Toggle */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title={isMobileFrame ? 'Full Desktop View' : 'Mobile App Frame View (390px)'}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                isMobileFrame
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {isMobileFrame ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Monitor className="w-4 h-4" />}
            </button>

            {/* Gemini API Setup Button */}
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isEnvKeyConfigured || getGeminiApiKey()
                  ? 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/80'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {isEnvKeyConfigured ? 'Gemini AI Active' : 'Gemini Config'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex border-t border-slate-800/80 bg-[#030712]/95 backdrop-blur-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center py-2.5 text-[11px] font-bold transition-colors ${
                  isActive ? 'text-cyan-400 bg-slate-900/60 border-t-2 border-cyan-400' : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Gemini API Key Information Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-700/60">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gemini AI Environment</h3>
                <p className="text-xs text-slate-400">Powering Voice Sentiment & Risk Analysis</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Standard <code className="text-cyan-400 font-mono">.env</code> Configuration
              </span>
              <p className="text-slate-400 text-[11px]">
                Kavach reads your Gemini API Key directly from <code className="text-cyan-300 font-mono">.env</code> or <code className="text-cyan-300 font-mono">.env.local</code> in the project root:
              </p>
              <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-cyan-300 border border-slate-800 select-all overflow-x-auto">
                VITE_GEMINI_API_KEY=your_key_here
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Session Override Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 py-3 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
