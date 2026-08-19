import { GoogleGenAI } from '@google/genai';

// Retrieve API key from environment variable or local setting
export const getGeminiApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('kavach_gemini_key') || '';
};

export const setGeminiApiKey = (key) => {
  localStorage.setItem('kavach_gemini_key', key);
};

/**
 * Helper to get a GenAI instance if key is available
 */
const getAiClient = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * 1. Distress detection from voice / text check-in transcript
 */
export async function analyzeVoiceDistress(transcript, userContext = {}) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    // High-fidelity fallback heuristic for zero-config demo
    return fallbackDistressAnalysis(transcript);
  }

  try {
    const ai = getAiClient();
    const prompt = `
You are Kavach's AI Safety Sentinel. Analyze the following voice check-in transcript from a user on a walk/commute.

USER TRANSCRIPT: "${transcript}"
USER CONTEXT: Destination: ${userContext.destination || 'Commute'}, Time: ${userContext.time || 'Night'}, Alone: true.

Determine if the user is in distress, calm, or uncertain. Look beyond simple keywords for:
- Hesitation markers (um, wait, who's that, stop, behind me, scared, running)
- Implicit fear or urgency
- Coerced or unnatural phrasing

Return ONLY valid JSON in this exact structure without markdown formatting or code blocks:
{
  "status": "distressed" | "uncertain" | "calm",
  "confidence": number between 0.0 and 1.0,
  "reasoning": "Clear 1-2 sentence explanation of distress signals or safety confirmation",
  "recommendedAction": "Immediate SOS alert dispatch" | "Follow-up check-in in 2 min" | "Normal safe commute status"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.warn('Gemini AI API call failed, falling back to local sentinel:', err);
    return fallbackDistressAnalysis(transcript);
  }
}

/**
 * Heuristic fallback for voice distress classification
 */
function fallbackDistressAnalysis(transcript) {
  const lower = transcript.toLowerCase();
  const panicKeywords = ['follow', 'following', 'scared', 'help', 'behind me', 'dark', 'run', 'someone', 'creepy', 'no no', 'stop', 'shadow', 'watching me'];
  const uncertainKeywords = ['unsure', 'weird', 'unlit', 'strange', 'uncomfortable', 'hurry', 'not sure'];

  const panicMatches = panicKeywords.filter(k => lower.includes(k));
  const uncertainMatches = uncertainKeywords.filter(k => lower.includes(k));

  if (panicMatches.length > 0) {
    return {
      status: 'distressed',
      confidence: 0.94,
      reasoning: `Distress markers detected: Flagged concerning phrasing ("${panicMatches.join(', ')}") indicating potential threat or safety concern.`,
      recommendedAction: 'Immediate SOS alert dispatch'
    };
  } else if (uncertainMatches.length > 0) {
    return {
      status: 'uncertain',
      confidence: 0.78,
      reasoning: `Uncertainty detected: Phrase contains hesitation markers ("${uncertainMatches.join(', ')}"). Scheduling prompt follow-up check-in.`,
      recommendedAction: 'Follow-up check-in in 2 min'
    };
  } else {
    return {
      status: 'calm',
      confidence: 0.98,
      reasoning: 'Voice transcript indicates calm, natural check-in with clear statement of safety.',
      recommendedAction: 'Normal safe commute status'
    };
  }
}

/**
 * 2. Risk-aware routing & risk scoring
 */
export async function assessRouteRisk(originName, destinationName, waypoints, incidents) {
  const apiKey = getGeminiApiKey();

  // Prepare summarized incident context
  const incidentSummary = incidents.map(inc => 
    `- [${inc.category.toUpperCase()}] ${inc.title} near (${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}): ${inc.description}`
  ).join('\n');

  if (!apiKey) {
    return fallbackRouteRiskAssessment(originName, destinationName, incidents);
  }

  try {
    const ai = getAiClient();
    const prompt = `
You are Kavach's AI Navigation Risk Engine. Evaluate a planned pedestrian commute from "${originName}" to "${destinationName}".

COMMUNITY INCIDENT REPORTS IN THE AREA:
${incidentSummary}

TASK:
1. Assess safety score (1-10 scale where 10 is safest, 1 is highest danger).
2. Highlight specific risk factors (e.g. unlit stretches, past harassment incidents, isolated alleys).
3. Formulate a 1-2 sentence human-readable safety explanation.
4. Suggest a safer alternate route if risk score is < 8.

Return ONLY valid JSON matching this schema:
{
  "riskScore": number between 1.0 and 10.0,
  "riskLevel": "Low Risk" | "Moderate Risk" | "High Risk",
  "reasoning": "Sentence explaining specific hazards along this path",
  "hazardsIdentified": ["hazard 1", "hazard 2"],
  "alternateRoute": {
    "name": "Well-lit Main Avenue Detour",
    "addedDistance": "+250m",
    "addedMinutes": "+3 mins",
    "safetyImprovement": "Avoids unlit alley and high-incident metro exit area"
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.warn('Gemini Route Risk API failed, using local risk engine:', err);
    return fallbackRouteRiskAssessment(originName, destinationName, incidents);
  }
}

function fallbackRouteRiskAssessment(origin, destination, incidents) {
  const count = incidents.length;
  const highSev = incidents.filter(i => i.severity === 'High').length;

  let riskScore = 8.5;
  let riskLevel = 'Low Risk';
  let reasoning = 'Route predominantly follows main thoroughfares with good lighting and steady pedestrian traffic.';
  
  if (highSev > 0 || count >= 3) {
    riskScore = 5.2;
    riskLevel = 'Moderate Risk';
    reasoning = `This path passes near an unlit stretch on Oak Alley and a past harassment report near Metro North Exit after 8:30 PM.`;
  }

  return {
    riskScore,
    riskLevel,
    reasoning,
    hazardsIdentified: [
      'Unlit stretch reported near Oak Alley (200m)',
      'Verbal harassment reported near Metro North Exit post 9PM'
    ],
    alternateRoute: {
      name: 'Bright Boulevard Safe Path',
      addedDistance: '+180m',
      addedMinutes: '+2 mins',
      safetyImprovement: 'Stays on active, camera-monitored commercial corridor'
    }
  };
}

/**
 * 3. Community Risk Zone Summarizer
 */
export async function clusterCommunityRiskZones(incidents) {
  const apiKey = getGeminiApiKey();
  if (!apiKey || incidents.length === 0) {
    return [
      {
        id: 'rz-1',
        title: 'Oak Alley Lighting Blackout Zone',
        incidentCount: 3,
        summary: 'Multiple reports of non-functional streetlights and low visibility after dusk.',
        advisory: 'Use main avenue parallel walk.'
      },
      {
        id: 'rz-2',
        title: 'Metro Underpass Night Hazard',
        incidentCount: 2,
        summary: 'Isolated pedestrian underpass with past harassment complaints post 9 PM.',
        advisory: 'Opt for surface crossing at 4th St.'
      }
    ];
  }

  try {
    const ai = getAiClient();
    const prompt = `
Group these community safety reports into 1-3 distinct geographical "Risk Zones":
${JSON.stringify(incidents)}

Return valid JSON array:
[
  {
    "id": "rz-1",
    "title": "Short catchy risk zone title",
    "incidentCount": number,
    "summary": "1-line summary of clustered issues",
    "advisory": "1-line safety advice for commuters"
  }
]
`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch {
    return [
      {
        id: 'rz-1',
        title: 'Oak Alley Blackout & Isolated Zone',
        incidentCount: incidents.length,
        summary: 'Clustered incidents regarding unlit stretches and isolated detours.',
        advisory: 'Stick to well-lit main thoroughfares.'
      }
    ];
  }
}
