import React, { useState } from 'react';
import { Shield, Users, Building2, MapPin, UserCheck, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';
import { CITY_PRESETS } from '../../data/seedIncidents';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentCity, changeCity } = useSafety();
  const { user, isGuest, loginAccount, logoutAccount } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authName, setAuthName] = useState('Vikash Kumar');
  const [authEmail, setAuthEmail] = useState('vk4845646@gmail.com');
  const [authPhone, setAuthPhone] = useState('+91 9631412596');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAccount({ name: authName, email: authEmail, phone: authPhone });
    setShowAuthModal(false);
  };

  const navItems = [
    { id: 'walk', label: 'Safe Walk', icon: Shield },
    { id: 'contacts', label: 'Trusted Feed', icon: Users },
    { id: 'warden', label: 'Security Desk', icon: Building2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
        {/* Guest Mode Non-Blocking Persistence Banner */}
        {isGuest && (
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 border-b border-teal-800/40 px-4 py-1.5 text-center text-xs flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Guest Mode Active • All safety actions & emergency alerts work immediately without an account.
            </span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-teal-400 hover:text-teal-300 font-extrabold underline ml-1 cursor-pointer"
            >
              Sign in to save contacts
            </button>
          </div>
        )}

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
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
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

            {/* Account / Guest Button */}
            {user ? (
              <button
                onClick={logoutAccount}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 text-xs font-bold transition-all"
                title="Sign out of account"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                <LogOut className="w-3 h-3 text-slate-500 ml-1" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
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

      {/* Account Sign In Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Sign In to Save Profile</h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Safety features like SOS and Safe Walks are always available without an account. Signing in saves your trusted contacts across devices.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Continue as Guest
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 shadow-lg shadow-teal-500/20"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
