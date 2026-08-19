import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import Navbar from './components/layout/Navbar';
import DevSimulatorBar from './components/layout/DevSimulatorBar';
import MapView from './components/map/MapView';
import ActiveWalkCard from './components/safewalk/ActiveWalkCard';
import StartWalkModal from './components/safewalk/StartWalkModal';
import InstantSOSButton from './components/alerts/InstantSOSButton';
import TrustedContactDashboard from './components/alerts/TrustedContactDashboard';
import WardenDashboard from './components/institutional/WardenDashboard';
import TrustedContactsList from './components/contacts/TrustedContactsList';
import IncidentReportForm from './components/community/IncidentReportForm';
import { Navigation, PlusCircle, Mic, MicOff, Shield, Eye, Radio, Sparkles, Smartphone, Monitor } from 'lucide-react';

function AppContent() {
  const {
    activeWalk,
    handsFreeEnabled,
    setHandsFreeEnabled,
    voiceSentinelActive,
    toggleVoiceSentinel
  } = useSafety();

  const [activeTab, setActiveTab] = useState('walk'); // 'walk' | 'contacts' | 'warden'
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showStartWalkModal, setShowStartWalkModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedCoordsForReport, setSelectedCoordsForReport] = useState(null);

  const handleSelectMapLocation = (coords) => {
    setSelectedCoordsForReport(coords);
    setShowReportForm(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
      />

      {/* Main Canvas */}
      <main className="flex-1 pb-28 pt-4 px-3 sm:px-6">
        <div className={`mx-auto transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[390px] border border-slate-700/60 rounded-[44px] p-4 bg-[#030712] shadow-2xl shadow-cyan-950/50 my-2 ring-8 ring-slate-900/80 overflow-hidden' 
            : 'max-w-7xl'
        }`}>

          {/* VIEW 1: SAFE WALK / COMMUTER VIEW */}
          {activeTab === 'walk' && (
            <div className="space-y-5">
              {/* Top Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Start Safe Walk Button */}
                <button
                  onClick={() => setShowStartWalkModal(true)}
                  disabled={activeWalk?.status === 'active'}
                  className={`p-3.5 rounded-2xl border font-black text-xs flex items-center justify-center space-x-2.5 transition-all shadow-xl ${
                    activeWalk?.status === 'active'
                      ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 text-slate-950 border-cyan-300 hover:brightness-110 shadow-cyan-500/25 glow-cyan'
                  }`}
                >
                  <Navigation className="w-5 h-5 stroke-[2.5]" />
                  <span className="uppercase tracking-wider">{activeWalk?.status === 'active' ? 'Walk Protection Active' : 'Start Safe Walk'}</span>
                </button>

                {/* Report Safety Hazard */}
                <button
                  onClick={() => setShowReportForm(!showReportForm)}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="uppercase tracking-wider">Report Safety Hazard</span>
                </button>

                {/* Hands-Free Wake Phrase */}
                <button
                  onClick={() => {
                    setHandsFreeEnabled(!handsFreeEnabled);
                    toggleVoiceSentinel();
                  }}
                  className={`p-3.5 rounded-2xl border font-extrabold text-xs flex items-center justify-center space-x-2.5 transition-all shadow-lg ${
                    voiceSentinelActive
                      ? 'bg-purple-950 border-purple-600 text-purple-200 animate-pulse'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {voiceSentinelActive ? <Mic className="w-5 h-5 text-purple-400" /> : <MicOff className="w-5 h-5" />}
                  <span className="uppercase tracking-wider">{voiceSentinelActive ? 'Voice Listening ("Kavach help")' : 'Wake Phrase'}</span>
                </button>
              </div>

              {/* Active Safe Walk Panel */}
              <ActiveWalkCard />

              {/* Community Hazard Form Drawer */}
              {showReportForm && (
                <IncidentReportForm
                  selectedCoords={selectedCoordsForReport}
                  onCancel={() => setShowReportForm(false)}
                />
              )}

              {/* Main Grid: Map + Action Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 2 Cols: Interactive Map */}
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Live Location & Safety Map
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">Tap map to drop pin</span>
                  </div>
                  <div className="h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                    <MapView onSelectIncidentLocation={handleSelectMapLocation} selectedLocationForReport={selectedCoordsForReport} />
                  </div>
                </div>

                {/* Right Col: Instant SOS + Trusted Circle */}
                <div className="space-y-5">
                  {/* Instant SOS Button */}
                  <InstantSOSButton />

                  {/* Trusted Contacts Circle */}
                  <TrustedContactsList />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: TRUSTED CONTACTS FEED */}
          {activeTab === 'contacts' && (
            <TrustedContactDashboard />
          )}

          {/* VIEW 3: CAMPUS WARDEN COMMAND CENTER */}
          {activeTab === 'warden' && (
            <WardenDashboard />
          )}
        </div>
      </main>

      {/* Start Safe Walk Modal */}
      <StartWalkModal
        isOpen={showStartWalkModal}
        onClose={() => setShowStartWalkModal(false)}
      />

      {/* Dev Simulator Bar */}
      <DevSimulatorBar />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafetyProvider>
        <AppContent />
      </SafetyProvider>
    </AuthProvider>
  );
}
