/**
 * Speech Recognition Wrapper (Web Speech API)
 */
export class VoiceSentinel {
  constructor(onWakePhrase, onTranscriptUpdate) {
    this.onWakePhrase = onWakePhrase;
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.recognition = null;
    this.isListening = false;
    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser environment');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(transcript);
        }

        const lower = transcript.toLowerCase();
        if (lower.includes('kavach help') || lower.includes('help me kavach') || lower.includes('emergency sos')) {
          if (this.onWakePhrase) {
            this.onWakePhrase(transcript);
          }
        }
      };

      this.recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
      };
    } catch (e) {
      console.warn('Speech initialization error:', e);
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.warn('Error starting speech listener:', e);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {
        console.warn('Error stopping speech listener:', e);
      }
    }
  }
}

/**
 * Device Motion Shake Detector
 */
export function initShakeDetector(onShakeTriggered) {
  let lastX = null, lastY = null, lastZ = null;
  let lastTime = new Date().getTime();
  const threshold = 18; // Shake acceleration magnitude threshold

  const handleMotion = (event) => {
    const current = event.accelerationIncludingGravity;
    if (!current) return;

    const currentTime = new Date().getTime();
    if ((currentTime - lastTime) > 100) {
      const diffTime = currentTime - lastTime;
      lastTime = currentTime;

      const x = current.x || 0;
      const y = current.y || 0;
      const z = current.z || 0;

      if (lastX !== null) {
        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        if (speed > threshold) {
          onShakeTriggered();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }
  };

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', handleMotion, false);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }
  return () => {};
}
