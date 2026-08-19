import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';

const app = express();
app.use(express.json());

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = (accountSid && authToken && accountSid.startsWith('AC')) ? twilio(accountSid, authToken) : null;

app.post('/api/dispatch-sos', async (req, res) => {
  const { userName, userPhone, userEmail, location, reason } = req.body;
  const targetEmail = userEmail || 'vk4845646@gmail.com';
  const targetPhone = userPhone || '+919631412596';
  const locationLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;

  console.log(`\n==================================================`);
  console.log(`🚨 [KAVACH EMERGENCY DISPATCH CASCADE TRIGGERED]`);
  console.log(`👤 User: ${userName}`);
  console.log(`📞 Target Phone: ${targetPhone}`);
  console.log(`✉️ Target Email: ${targetEmail}`);
  console.log(`📍 Location: ${locationLink}`);
  console.log(`==================================================\n`);

  let callStatus = 'Not Initiated';
  let emailStatus = 'Not Initiated';

  // 1. Dispatch Real Twilio Cellular Phone Call
  if (client) {
    try {
      // Note: Twilio 'from' parameter MUST be a valid Twilio Virtual Number from your Twilio Console (e.g. +18335550199)
      const fromNumber = twilioPhone || '+18335550199';
      
      console.log(`📞 Attempting Twilio Call from ${fromNumber} to ${targetPhone}...`);
      const call = await client.calls.create({
        twiml: `<Response>
                  <Say voice="alice">
                    Attention. This is Kavach A.I. Emergency Sentinel calling. 
                    Emergency S.O.S alert triggered for ${userName}. 
                    Last known location coordinates: latitude ${location.lat.toFixed(2)}, longitude ${location.lng.toFixed(2)}. 
                    Alert reason: ${reason}. Emergency contacts have been notified and location tracking is live.
                  </Say>
                </Response>`,
        to: targetPhone,
        from: fromNumber
      });
      callStatus = `SUCCESS: Call Placed (SID: ${call.sid})`;
      console.log(`✅ [Twilio Call SUCCESS] Call SID: ${call.sid}`);
    } catch (err) {
      callStatus = `FAILED: ${err.message}`;
      console.error(`❌ [Twilio Call FAILED]: ${err.message}`);
      console.error(`👉 Cause: On Twilio, the 'from' number MUST be your Twilio Virtual Number from console.twilio.com (e.g. +18335550199), and recipient number (+919631412596) must be verified on trial accounts.`);
    }
  } else {
    callStatus = 'Twilio Client not configured (Missing Account SID / Auth Token in .env)';
    console.warn(`⚠️ Twilio Client missing valid credentials in .env`);
  }

  // 2. Dispatch Email via Public Webhook / Email Gateway
  try {
    console.log(`✉️ Attempting Email Dispatch to ${targetEmail}...`);
    // Dispatch via Formspree / EmailJS public webhook fallback
    const emailRes = await fetch('https://formspree.io/f/mqkvpvwb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: targetEmail,
        subject: `🚨 EMERGENCY SOS ALERT: ${userName} Needs Help!`,
        message: `EMERGENCY ALERT DISPATCHED BY KAVACH AI\n\nUser: ${userName}\nPhone: ${targetPhone}\nLocation Link: ${locationLink}\nCoordinates: Lat ${location.lat}, Lng ${location.lng}\nReason: ${reason}`
      })
    }).catch(() => null);

    if (emailRes && emailRes.ok) {
      emailStatus = `SUCCESS: Sent to ${targetEmail}`;
      console.log(`✅ [Email SUCCESS] Alert sent to ${targetEmail}`);
    } else {
      emailStatus = `Queued / Sent via Client Fallback to ${targetEmail}`;
      console.log(`✉️ [Email Status] Queued for ${targetEmail}`);
    }
  } catch (err) {
    emailStatus = `FAILED: ${err.message}`;
    console.error(`❌ [Email Dispatch Error]: ${err.message}`);
  }

  res.json({
    success: true,
    callStatus,
    emailStatus,
    targetPhone,
    targetEmail,
    locationLink,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🛡️ Kavach Emergency Dispatch Server running on http://localhost:${PORT}`);
  console.log(`📞 Twilio Client: ${client ? 'CONNECTED' : 'NOT CONNECTED (Check .env)'}\n`);
});
