const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const toPhone = '+19453650325';
const localtunnelUrl = 'https://moody-vans-warn.loca.lt/';

if (!sid || !token) {
    console.error("Missing Twilio credentials");
    process.exit(1);
}

const auth = Buffer.from(sid + ':' + token).toString('base64');

async function makeCall() {
    console.log(`Initiating outbound call to ${toPhone} from ${fromPhone}...`);
    
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
        method: 'POST',
        headers: { 
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            To: toPhone,
            From: fromPhone,
            Url: localtunnelUrl
        }).toString()
    });
    
    const data = await res.json();
    if (data.sid) {
        console.log("SUCCESS: Call initiated. Call SID:", data.sid);
    } else {
        console.error("FAILED to initiate call:", data);
    }
}

makeCall();
