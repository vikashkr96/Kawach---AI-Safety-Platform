import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, AlertTriangle, Moon, ShieldCheck, MapPin, Eye, Layers } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

// Custom Leaflet Markers
const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute inset-0 rounded-full bg-cyan-400 opacity-60 animate-ping"></div>
        <div class="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

const createIncidentIcon = (category) => {
  let color = '#f59e0b';
  if (category === 'harassment') color = '#ef4444';
  if (category === 'lighting') color = '#3b82f6';
  if (category === 'isolated_stretch') color = '#8b5cf6';

  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div class="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-slate-950" style="background-color: ${color}">
        <span style="font-size: 13px;">⚠️</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapView({ onSelectIncidentLocation, selectedLocationForReport }) {
  const { currentLocation, plannedRoute, incidents, riskZones, activeWalk, currentCity } = useSafety();
  const [showLegend, setShowLegend] = useState(false);

  const handleMapClick = (latlng) => {
    if (onSelectIncidentLocation) {
      onSelectIncidentLocation({ lat: latlng.lat, lng: latlng.lng });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#030712]">
      <MapContainer
        center={[currentCity.lat, currentCity.lng]}
        zoom={currentCity.zoom || 14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        {/* Dark Voyager CartoDB Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onMapClick={handleMapClick} />

        {/* Current User Marker */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={createUserIcon()}>
            <Popup>
              <div className="p-1">
                <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Live Location Sentinel</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                </p>
                <p className="text-[11px] text-slate-400">
                  Status: {activeWalk ? `Active Walk (${activeWalk.riskLevel})` : 'Safe'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Planned Route Polyline */}
        {plannedRoute && plannedRoute.length > 0 && (
          <Polyline
            positions={plannedRoute.map(p => [p.lat, p.lng])}
            pathOptions={{ color: '#06b6d4', weight: 5, opacity: 0.9, dashArray: '8, 8' }}
          />
        )}

        {/* Community Incident Markers */}
        {incidents.map((inc) => (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.lng]}
            icon={createIncidentIcon(inc.category)}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs uppercase mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{inc.category.replace('_', ' ')}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{inc.title}</h4>
                <p className="text-[11px] text-slate-300 mb-1">{inc.description}</p>
                <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-700/60 pt-1 mt-1">
                  <span>Time: {inc.timeOfDay || 'Night'}</span>
                  <span>Severity: {inc.severity}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* AI Clustered Risk Zones */}
        {riskZones.map((rz, idx) => (
          <Circle
            key={rz.id || idx}
            center={[currentCity.lat + (idx === 0 ? 0.003 : -0.003), currentCity.lng + (idx === 0 ? -0.002 : 0.004)]}
            radius={240}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '4, 4'
            }}
          />
        ))}

        {/* Selected Incident Pin */}
        {selectedLocationForReport && (
          <Marker
            position={[selectedLocationForReport.lat, selectedLocationForReport.lng]}
            icon={L.divIcon({
              className: 'selected-report-pin',
              html: `<div class="w-6 h-6 rounded-full bg-amber-500 border-2 border-white animate-bounce shadow-xl"></div>`,
              iconSize: [24, 24]
            })}
          />
        )}
      </MapContainer>

      {/* Non-overlapping Collapsible Map Legend Pill at Bottom-Right */}
      <div className="absolute bottom-3 right-3 z-10">
        {!showLegend ? (
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold shadow-xl backdrop-blur-md"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Layers</span>
          </button>
        ) : (
          <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-2 max-w-[200px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-200 font-extrabold">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> Layer Legend
              </span>
              <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>You (Live Position)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Community Hazard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500"></span>
                <span>AI Risk Zone</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
