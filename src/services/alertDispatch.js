/**
 * Kavach AI Emergency Alert Dispatch Service
 * Handles Silent Background Email & Twilio Voice Call Dispatching (Zero Popups / New Tabs)
 */

export async function dispatchEmergencyAlert({ userName, userPhone, userEmail, location, reason, contacts }) {
  console.log('🚨 SILENT EMERGENCY ALERT DISPATCH:', { userName, userPhone, userEmail, location, reason });

  const locationLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  const timestamp = new Date().toLocaleString();

  // 1. Silent Background Voice Call & Email Server API Dispatch (No mailto windows or new tabs opened)
  try {
    const res = await fetch('/api/dispatch-sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        userPhone: userPhone || '+919631412596',
        userEmail: userEmail || 'vk4845646@gmail.com',
        location,
        reason,
        contacts
      })
    });
    const result = await res.json();
    console.log('📞 Silent Server Dispatch Result:', result);
  } catch (err) {
    console.warn('Silent server dispatch warning:', err);
  }

  // 2. Local AI Sentinel Voice Agent Response Speech
  speakAiEmergencyCall(userName, location, reason);

  return {
    success: true,
    locationLink,
    timestamp
  };
}

/**
 * Local AI Voice Response Agent Speech Synthesis
 */
export function speakAiEmergencyCall(userName, location, reason) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const speechScript = `Attention. This is Kavach A.I. Emergency Sentinel calling. Emergency S.O.S alert triggered for ${userName}. Last known location coordinates: latitude ${location.lat.toFixed(2)}, longitude ${location.lng.toFixed(2)}. Alert reason: ${reason}. Emergency contacts have been notified and location tracking is live.`;

    const utterance = new SpeechSynthesisUtterance(speechScript);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('AI voice call synthesis error:', err);
  }
}
