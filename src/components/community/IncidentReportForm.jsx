import React, { useState } from 'react';
import { AlertTriangle, MapPin, Send, Check } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function IncidentReportForm({ selectedCoords, onCancel }) {
  const { currentLocation, submitIncidentReport } = useSafety();

  const [category, setCategory] = useState('lighting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'lighting', label: 'Unlit / Broken Lights', icon: '💡' },
    { id: 'harassment', label: 'Past Harassment', icon: '🚨' },
    { id: 'isolated_stretch', label: 'Isolated Stretch / Alley', icon: '🌑' },
    { id: 'unsafe_crossing', label: 'Unsafe Crossing', icon: '⚠️' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const loc = selectedCoords || { lat: currentLocation.lat + 0.002, lng: currentLocation.lng + 0.002 };

    submitIncidentReport({
      category,
      title: title.trim(),
      description: description.trim() || 'Reported by local community member.',
      lat: loc.lat,
      lng: loc.lng,
      severity,
      timeOfDay: 'Night (Post 8PM)',
      reporter: 'Community Walk Sentinel'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onCancel) onCancel();
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-700/60">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Report Community Safety Hazard</h3>
            <p className="text-[11px] text-slate-400">Updates live map & Gemini AI route-risk engine</p>
          </div>
        </div>
        {onCancel && <button onClick={onCancel} className="text-slate-400 hover:text-white text-sm">✕</button>}
      </div>

      {submitted ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h4 className="text-sm font-bold text-white">Report Logged Successfully!</h4>
          <p className="text-xs text-slate-400">Added to community risk map and route scoring layer.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Hazard Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-2 text-left ${
                    category === cat.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Title / Summary</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken streetlights on 4th St alley"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Details (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe timing, exact location, or observed safety concerns..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Location Info */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              Location: {selectedCoords ? `Selected (${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)})` : 'Current Area Pin'}
            </span>
            <span className="text-[10px] text-amber-400 font-extrabold">Tap map to set pin</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>PUBLISH HAZARD REPORT</span>
          </button>
        </form>
      )}
    </div>
  );
}
