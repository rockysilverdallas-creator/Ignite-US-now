const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE_NUMBER;

if (!sid || !token) {
    console.error("Missing Twilio credentials");
    process.exit(1);
}

const auth = Buffer.from(sid + ':' + token).toString('base64');
const localtunnelUrl = 'https://moody-vans-feel.loca.lt/';

async function updateWebhook() {
    // 1. Get the IncomingPhoneNumber SID for the phone number
    const getRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phone)}`, {
        headers: { 'Authorization': `Basic ${auth}` }
    });
    const data = await getRes.json();
    if (!data.incoming_phone_numbers || data.incoming_phone_numbers.length === 0) {
        console.error("Could not find Twilio phone number:", phone);
        process.exit(1);
    }
    
    const phoneSid = data.incoming_phone_numbers[0].sid;
    
    // 2. Update the VoiceUrl
    const updateRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/IncomingPhoneNumbers/${phoneSid}.json`, {
        method: 'POST',
        headers: { 
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ VoiceUrl: localtunnelUrl }).toString()
    });
    
    const updateData = await updateRes.json();
    if (updateData.voice_url === localtunnelUrl) {
        console.log("SUCCESS: Webhook updated to " + localtunnelUrl);
    } else {
        console.error("FAILED:", updateData);
    }
}

updateWebhook();
