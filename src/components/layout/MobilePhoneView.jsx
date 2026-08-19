import React, { useState } from 'react';
import { 
  Shield, Navigation, Mic, PlusCircle, AlertTriangle, Home, Users, Building2, 
  Clock, MapPin, Bell, ChevronRight, CheckCircle2, Radio, Activity
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';
import MapView from '../map/MapView';
import ActiveWalkCard from '../safewalk/ActiveWalkCard';
import InstantSOSButton from '../alerts/InstantSOSButton';
import StartWalkModal from '../safewalk/StartWalkModal';
import VoiceCheckInModal from '../safewalk/VoiceCheckInModal';
import IncidentReportForm from '../community/IncidentReportForm';

export default function MobilePhoneView({ activeTab, setActiveTab }) {
  const { activeWalk } = useSafety();
  const { user } = useAuth();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Avatar initials (e.g. Vikash Kumar -> VK)
  const getInitials = (nameStr) => {
    if (!nameStr) return 'VK';
    const parts = nameStr.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Vikash';

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-[720px] bg-slate-50 text-slate-900 rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Main Scrollable Mobile Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4 bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50">

        {/* Dynamic User Profile Greeting Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-teal-500/20">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Hi, {firstName} 👋</h2>
              <p className="text-[11px] font-medium text-slate-500">Ready for a safe walk?</p>
            </div>
          </div>

          <button className="p-2.5 rounded-2xl bg-white text-slate-700 shadow-md shadow-slate-200/60 border border-slate-100 relative">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>
        </div>

        {/* Safety Score Gauge Card */}
        <div className="bg-white rounded-[26px] p-4 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="#10b981"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset="28"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">85%</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                Safety Rating
              </span>
              <h3 className="text-xs font-extrabold text-slate-900 mt-0.5">High Safe Zone Coverage</h3>
              <p className="text-[10px] font-medium text-slate-500">3 Trusted Contacts Active</p>
            </div>
          </div>
        </div>

        {/* Quick Actions 2x2 Grid Pills */}
        <div>
          <span className="text-xs font-extrabold text-slate-900 block mb-2">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Action 1: Start Walk */}
            <button
              onClick={() => setShowStartModal(true)}
              className="bg-emerald-500 text-white p-3.5 rounded-[22px] shadow-lg shadow-emerald-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <Navigation className="w-5 h-5 mb-1 text-white" />
                <span>Start Walk</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            {/* Action 2: Voice Check-In */}
            <button
              onClick={() => setShowVoiceModal(true)}
              className="bg-amber-500 text-white p-3.5 rounded-[22px] shadow-lg shadow-amber-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <Mic className="w-5 h-5 mb-1 text-white" />
                <span>Voice Check-in</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            {/* Action 3: Report Hazard */}
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="bg-cyan-500 text-white p-3.5 rounded-[22px] shadow-lg shadow-cyan-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <PlusCircle className="w-5 h-5 mb-1 text-white" />
                <span>Report Hazard</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            {/* Action 4: Instant SOS */}
            <button
              onClick={() => {
                const sosBtn = document.getElementById('mobile-sos-trigger');
                if (sosBtn) sosBtn.click();
              }}
              className="bg-rose-500 text-white p-3.5 rounded-[22px] shadow-lg shadow-rose-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <AlertTriangle className="w-5 h-5 mb-1 text-white animate-bounce" />
                <span>Instant SOS</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

          </div>
        </div>

        {/* Active Walk Panel */}
        {activeWalk?.status === 'active' && (
          <ActiveWalkCard />
        )}

        {/* Report Hazard Drawer */}
        {showReportForm && (
          <IncidentReportForm onCancel={() => setShowReportForm(false)} />
        )}

        {/* Emergency SOS Button */}
        <div id="mobile-sos-trigger">
          <InstantSOSButton />
        </div>

        {/* Live Safety Map */}
        <div className="bg-white rounded-[26px] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              Live Safety Map
            </span>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              GPS Active
            </span>
          </div>
          <div className="h-48 rounded-[20px] overflow-hidden border border-slate-100">
            <MapView />
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-2 left-3 right-3 bg-slate-900 text-white rounded-full p-2 flex items-center justify-around shadow-2xl border border-slate-800 z-30">
        <button
          onClick={() => setActiveTab('walk')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all ${
            activeTab === 'walk' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          {activeTab === 'walk' && <span className="text-xs">Home</span>}
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all ${
            activeTab === 'contacts' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          {activeTab === 'contacts' && <span className="text-xs">Feed</span>}
        </button>

        <button
          onClick={() => setActiveTab('warden')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all ${
            activeTab === 'warden' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {activeTab === 'warden' && <span className="text-xs">Security</span>}
        </button>
      </div>

      {/* Modals */}
      <StartWalkModal isOpen={showStartModal} onClose={() => setShowStartModal(false)} />
      <VoiceCheckInModal isOpen={showVoiceModal} onClose={() => setShowVoiceModal(false)} />
    </div>
  );
}
