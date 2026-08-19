import React, { useState } from 'react';
import { 
  Shield, Navigation, Mic, PlusCircle, AlertTriangle, Home, Users, Building2, 
  Clock, MapPin, Bell, ChevronRight, CheckCircle2, Radio, Sparkles, Activity
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import MapView from '../map/MapView';
import ActiveWalkCard from '../safewalk/ActiveWalkCard';
import InstantSOSButton from '../alerts/InstantSOSButton';
import StartWalkModal from '../safewalk/StartWalkModal';
import VoiceCheckInModal from '../safewalk/VoiceCheckInModal';
import IncidentReportForm from '../community/IncidentReportForm';

export default function MobilePhoneView({ activeTab, setActiveTab }) {
  const { activeWalk, currentLocation, incidents, riskZones } = useSafety();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-[780px] bg-slate-50 text-slate-900 rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col relative font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Phone Notch / Dynamic Island */}
      <div className="w-full bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between text-white text-[11px] font-bold">
        <span>9:41</span>
        <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px]">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Scrollable Mobile App Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-4 bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50">

        {/* 1. Header & Greeting Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-extrabold shadow-lg shadow-teal-500/30">
              AS
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-sm font-extrabold text-slate-900">Hi, Ananya 👋</h2>
              </div>
              <p className="text-[11px] font-medium text-slate-500">Ready for a safe walk?</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2.5 rounded-2xl bg-white text-slate-700 shadow-md shadow-slate-200/50 border border-slate-100 relative">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
          </div>
        </div>

        {/* 2. Today's Progress / Safety Score Card (Soft Neumorphic Style from Reference Image) */}
        <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Circular Gauge Ring */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163"
                  strokeDashoffset="35"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">82%</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                Safety Rating
              </span>
              <h3 className="text-xs font-extrabold text-slate-900 mt-1">High Safe Zone Coverage</h3>
              <p className="text-[10px] font-medium text-slate-500">3 Verified Contacts Active</p>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions 2x2 Grid Pills (Matching Reference UI Layout) */}
        <div>
          <span className="text-xs font-extrabold text-slate-900 block mb-2">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Action 1: Start Walk */}
            <button
              onClick={() => setShowStartModal(true)}
              className="bg-emerald-500 text-white p-3.5 rounded-[24px] shadow-lg shadow-emerald-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
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
              className="bg-amber-500 text-white p-3.5 rounded-[24px] shadow-lg shadow-amber-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
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
              className="bg-cyan-500 text-white p-3.5 rounded-[24px] shadow-lg shadow-cyan-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <PlusCircle className="w-5 h-5 mb-1 text-white" />
                <span>Report Hazard</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

            {/* Action 4: Emergency SOS */}
            <button
              onClick={() => {
                const sosBtn = document.getElementById('mobile-sos-trigger');
                if (sosBtn) sosBtn.click();
              }}
              className="bg-rose-500 text-white p-3.5 rounded-[24px] shadow-lg shadow-rose-500/25 flex items-center justify-between font-bold text-xs hover:brightness-105 transition-all text-left"
            >
              <div>
                <AlertTriangle className="w-5 h-5 mb-1 text-white animate-bounce" />
                <span>Instant SOS</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </button>

          </div>
        </div>

        {/* 4. Active Walk Panel (if active) */}
        {activeWalk?.status === 'active' && (
          <ActiveWalkCard />
        )}

        {/* 5. Report Hazard Form Drawer */}
        {showReportForm && (
          <IncidentReportForm onCancel={() => setShowReportForm(false)} />
        )}

        {/* 6. Emergency SOS Card */}
        <div id="mobile-sos-trigger">
          <InstantSOSButton />
        </div>

        {/* 7. Interactive Live Map (Clean Soft Border) */}
        <div className="bg-white rounded-[28px] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-2">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              Live Safety Map
            </span>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              GPS Active
            </span>
          </div>
          <div className="h-52 rounded-[22px] overflow-hidden border border-slate-100">
            <MapView />
          </div>
        </div>

      </div>

      {/* 8. Floating Bottom Navigation Bar (Matches Reference Image UI) */}
      <div className="absolute bottom-3 left-4 right-4 bg-slate-900 text-white rounded-full p-2 flex items-center justify-around shadow-2xl border border-slate-800 z-30">
        <button
          onClick={() => setActiveTab('walk')}
          className={`flex flex-col items-center p-2 rounded-full transition-all ${
            activeTab === 'walk' ? 'bg-teal-500 text-white px-4' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('walk')}
          className={`flex flex-col items-center p-2 rounded-full transition-all ${
            activeTab === 'walk' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Navigation className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center p-2 rounded-full transition-all ${
            activeTab === 'contacts' ? 'bg-teal-500 text-white px-4' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('warden')}
          className={`flex flex-col items-center p-2 rounded-full transition-all ${
            activeTab === 'warden' ? 'bg-teal-500 text-white px-4' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5" />
        </button>
      </div>

      {/* Modals */}
      <StartWalkModal isOpen={showStartModal} onClose={() => setShowStartModal(false)} />
      <VoiceCheckInModal isOpen={showVoiceModal} onClose={() => setShowVoiceModal(false)} />
    </div>
  );
}
