import React from 'react';
import { Shield, Users, Building2, MapPin, Smartphone, Monitor } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { CITY_PRESETS } from '../../data/seedIncidents';

export default function Navbar({ activeTab, setActiveTab, isMobileFrame, setIsMobileFrame }) {
  const { currentCity, changeCity } = useSafety();

  const navItems = [
    { id: 'walk', label: 'Safe Walk', icon: Shield },
    { id: 'contacts', label: 'Trusted Feed', icon: Users },
    { id: 'warden', label: 'Security Desk', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & Brand Identity */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => setActiveTab('walk')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg text-white tracking-tight">
                KAVACH
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60">
                कवच
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">AI Safety Companion</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center space-x-2.5">
          {/* City Preset Selector */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
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

          {/* Mobile Preview Switcher Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Switch to Fullscreen View' : 'Switch to Mobile Phone View'}
            className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
              isMobileFrame
                ? 'bg-teal-950 text-teal-300 border-teal-700/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isMobileFrame ? <Smartphone className="w-4 h-4 text-teal-400" /> : <Monitor className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden flex border-t border-slate-800/80 bg-[#030712]/95 backdrop-blur-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-2.5 text-[11px] font-bold transition-colors ${
                isActive ? 'text-teal-400 bg-slate-900/60 border-t-2 border-teal-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
