import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { localStore } from '../services/firebase';
import { INITIAL_CONTACTS } from '../data/seedContacts';
import { SEED_INCIDENTS, CITY_PRESETS } from '../data/seedIncidents';
import { calculateDistanceMeters, calculateDeviationFromRoute, generateRoutePoints } from '../services/geolocation';
import { assessRouteRisk, analyzeVoiceDistress, clusterCommunityRiskZones } from '../services/gemini';
import { VoiceSentinel, initShakeDetector } from '../services/speech';

const SafetyContext = createContext();

export function SafetyProvider({ children }) {
  // City center & maps location
  const [currentCity, setCurrentCity] = useState(CITY_PRESETS[0]);
  const [currentLocation, setCurrentLocation] = useState({
    lat: CITY_PRESETS[0].lat,
    lng: CITY_PRESETS[0].lng,
    heading: 0,
    speed: 1.2 // m/s walking
  });

  // Contacts
  const [contacts, setContacts] = useState(() => {
    return localStore.get('kavach_contacts', INITIAL_CONTACTS);
  });

  // Incidents & Risk Zones
  const [incidents, setIncidents] = useState(() => {
    return localStore.get('kavach_incidents', SEED_INCIDENTS);
  });
  const [riskZones, setRiskZones] = useState([]);

  // Active Safe Walk state
  const [activeWalk, setActiveWalk] = useState(() => {
    return localStore.get('kavach_active_walk', null);
  });
  const [plannedRoute, setPlannedRoute] = useState(null);
  const [routeRiskAnalysis, setRouteRiskAnalysis] = useState(null);

  // Alerts & SMS Fallback Queue
  const [alerts, setAlerts] = useState(() => {
    return localStore.get('kavach_alerts', []);
  });
  const [offlineSmsQueue, setOfflineSmsQueue] = useState([]);

  // Hands-free & Offline settings
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [handsFreeEnabled, setHandsFreeEnabled] = useState(false);
  const [voiceSentinelActive, setVoiceSentinelActive] = useState(false);

  // Dev simulator parameters
  const [isSimulatingMovement, setIsSimulatingMovement] = useState(false);
  const [simulatedDeviationMeters, setSimulatedDeviationMeters] = useState(0);

  // References for timers & voice
  const timerRef = useRef(null);
  const movementRef = useRef(null);
  const voiceSentinelRef = useRef(null);

  // Sync state to localStore
  useEffect(() => {
    localStore.emit('kavach_contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    localStore.emit('kavach_incidents', incidents);
    clusterCommunityRiskZones(incidents).then(setRiskZones);
  }, [incidents]);

  useEffect(() => {
    localStore.emit('kavach_active_walk', activeWalk);
  }, [activeWalk]);

  useEffect(() => {
    localStore.emit('kavach_alerts', alerts);
  }, [alerts]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Flush offline SMS queue if present
      if (offlineSmsQueue.length > 0) {
        console.log('📡 Back online! Dispatching queued SMS alerts:', offlineSmsQueue);
        setOfflineSmsQueue([]);
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineSmsQueue]);

  // Shake detector setup
  useEffect(() => {
    if (handsFreeEnabled) {
      const cleanup = initShakeDetector(() => {
        triggerSOS('Device Shake Gesture Triggered');
      });
      return cleanup;
    }
  }, [handsFreeEnabled]);

  // Real GPS watch position
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (!isSimulatingMovement) {
            setCurrentLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              heading: pos.coords.heading || 0,
              speed: pos.coords.speed || 1.2
            });
          }
        },
        (err) => console.warn('Browser geolocation warning:', err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isSimulatingMovement]);

  // Active Safe Walk countdown timer logic (Auto-escalation check)
  useEffect(() => {
    if (!activeWalk || activeWalk.status !== 'active') return;

    timerRef.current = setInterval(() => {
      setActiveWalk(prev => {
        if (!prev) return null;
        const now = Date.now();
        const secondsRemaining = Math.max(0, Math.ceil((prev.expectedArrivalTime - now) / 1000));

        // Auto-escalation check: Timer reached 0 (Deadline + Grace expired)
        if (secondsRemaining <= 0 && prev.status === 'active') {
          triggerAutoEscalation(prev);
          return { ...prev, status: 'escalated' };
        }
        return { ...prev, secondsRemaining };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeWalk?.id, activeWalk?.status]);

  // Deviation detection while walk is active
  useEffect(() => {
    if (!activeWalk || activeWalk.status !== 'active' || !plannedRoute) return;

    const deviation = calculateDeviationFromRoute(currentLocation, plannedRoute);
    if (deviation > 150 && !activeWalk.hasAlertedDeviation) {
      triggerDeviationAlert(deviation);
    }
  }, [currentLocation, activeWalk?.id, plannedRoute]);

  // Simulated movement walk execution
  useEffect(() => {
    if (!isSimulatingMovement || !plannedRoute || plannedRoute.length < 2) return;

    let stepIndex = 0;
    movementRef.current = setInterval(() => {
      stepIndex = (stepIndex + 1) % plannedRoute.length;
      const targetPoint = plannedRoute[stepIndex];

      // Add dev deviation offset if requested
      const latOffset = simulatedDeviationMeters > 0 ? (simulatedDeviationMeters / 111111) : 0;
      
      setCurrentLocation({
        lat: targetPoint.lat + latOffset,
        lng: targetPoint.lng,
        heading: 45,
        speed: 1.4
      });
    }, 3000);

    return () => clearInterval(movementRef.current);
  }, [isSimulatingMovement, plannedRoute, simulatedDeviationMeters]);

  // Functions

  const changeCity = (cityPreset) => {
    setCurrentCity(cityPreset);
    setCurrentLocation({
      lat: cityPreset.lat,
      lng: cityPreset.lng,
      heading: 0,
      speed: 1.2
    });
  };

  const addContact = (contact) => {
    const newContact = { ...contact, id: 'c-' + Date.now() };
    setContacts(prev => [...prev, newContact]);
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const planSafeWalk = async (destinationName, durationMinutes = 15) => {
    const destLat = currentLocation.lat + 0.008;
    const destLng = currentLocation.lng + 0.008;
    const waypoints = generateRoutePoints(currentLocation, { lat: destLat, lng: destLng });
    setPlannedRoute(waypoints);

    // Call Gemini for risk-aware routing
    const riskData = await assessRouteRisk(
      'Current Location',
      destinationName,
      waypoints,
      incidents
    );
    setRouteRiskAnalysis(riskData);
    return { waypoints, riskData };
  };

  const startWalk = (destinationName, durationMinutes = 15, routeInfo = null) => {
    const now = Date.now();
    const expectedArrival = now + durationMinutes * 60 * 1000;
    
    const newWalk = {
      id: 'walk-' + Date.now(),
      originName: 'Current Location',
      destinationName,
      startTime: now,
      expectedArrivalTime: expectedArrival,
      durationMinutes,
      graceMinutes: 2,
      secondsRemaining: durationMinutes * 60,
      status: 'active', // 'active' | 'arrived' | 'escalated'
      riskScore: routeInfo?.riskScore || 8.0,
      riskLevel: routeInfo?.riskLevel || 'Low Risk',
      hasAlertedDeviation: false
    };

    setActiveWalk(newWalk);
    setIsSimulatingMovement(true);
  };

  const arriveSafely = () => {
    if (activeWalk) {
      setActiveWalk(prev => ({ ...prev, status: 'arrived' }));
      setIsSimulatingMovement(false);
      
      // Dispatch safe arrival alert to contacts
      const safeNotification = {
        id: 'alert-' + Date.now(),
        type: 'SAFE_ARRIVAL',
        userName: 'Ananya Sharma',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Checked in safely at ' + (activeWalk.destinationName || 'destination'),
        location: { ...currentLocation }
      };
      setAlerts(prev => [safeNotification, ...prev]);
    }
  };

  const performVoiceCheckIn = async (transcript) => {
    const analysis = await analyzeVoiceDistress(transcript, {
      destination: activeWalk?.destinationName
    });

    if (analysis.status === 'distressed') {
      triggerSOS(`Voice Distress Flagged: "${transcript}" — ${analysis.reasoning}`);
    }
    return analysis;
  };

  const triggerSOS = (customReason = 'SOS Button Pressed') => {
    const newAlert = {
      id: 'alert-' + Date.now(),
      type: 'SOS',
      severity: 'CRITICAL',
      userName: 'Ananya Sharma',
      userPhone: '+1 (555) 987-6543',
      timestamp: new Date().toLocaleTimeString(),
      fullDate: new Date().toISOString(),
      reason: customReason,
      location: { ...currentLocation },
      contactsNotified: contacts,
      status: 'ACTIVE'
    };

    setAlerts(prev => [newAlert, ...prev]);

    if (isOffline) {
      setOfflineSmsQueue(prev => [...prev, { alert: newAlert, queuedAt: new Date().toLocaleTimeString() }]);
    }
  };

  const triggerAutoEscalation = (walk) => {
    const escalationAlert = {
      id: 'alert-' + Date.now(),
      type: 'MISSED_CHECKIN',
      severity: 'HIGH',
      userName: 'Ananya Sharma',
      userPhone: '+1 (555) 987-6543',
      timestamp: new Date().toLocaleTimeString(),
      fullDate: new Date().toISOString(),
      reason: `Missed arrival check-in deadline (+2m grace) for ${walk.destinationName}`,
      location: { ...currentLocation },
      contactsNotified: contacts,
      status: 'ACTIVE'
    };

    setAlerts(prev => [escalationAlert, ...prev]);
  };

  const triggerDeviationAlert = (meters) => {
    if (activeWalk) {
      setActiveWalk(prev => ({ ...prev, hasAlertedDeviation: true }));
      const devAlert = {
        id: 'alert-' + Date.now(),
        type: 'DEVIATION',
        severity: 'MEDIUM',
        userName: 'Ananya Sharma',
        timestamp: new Date().toLocaleTimeString(),
        reason: `Route deviation detected: User is ${meters}m off planned safe path`,
        location: { ...currentLocation },
        contactsNotified: contacts,
        status: 'ACTIVE'
      };
      setAlerts(prev => [devAlert, ...prev]);
    }
  };

  const submitIncidentReport = (report) => {
    const newIncident = {
      ...report,
      id: 'inc-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const toggleVoiceSentinel = () => {
    if (!voiceSentinelActive) {
      voiceSentinelRef.current = new VoiceSentinel(
        (phrase) => triggerSOS(`Wake Phrase Triggered ("${phrase}")`),
        () => {}
      );
      voiceSentinelRef.current.start();
      setVoiceSentinelActive(true);
    } else {
      if (voiceSentinelRef.current) voiceSentinelRef.current.stop();
      setVoiceSentinelActive(false);
    }
  };

  return (
    <SafetyContext.Provider value={{
      currentCity,
      changeCity,
      currentLocation,
      setCurrentLocation,
      contacts,
      addContact,
      removeContact,
      incidents,
      riskZones,
      activeWalk,
      plannedRoute,
      routeRiskAnalysis,
      alerts,
      offlineSmsQueue,
      isOffline,
      setIsOffline,
      handsFreeEnabled,
      setHandsFreeEnabled,
      voiceSentinelActive,
      toggleVoiceSentinel,
      isSimulatingMovement,
      setIsSimulatingMovement,
      simulatedDeviationMeters,
      setSimulatedDeviationMeters,
      planSafeWalk,
      startWalk,
      arriveSafely,
      performVoiceCheckIn,
      triggerSOS,
      submitIncidentReport
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  return useContext(SafetyContext);
}
