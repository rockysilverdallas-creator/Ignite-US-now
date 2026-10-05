import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const grok = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
});

const systemPrompt = `You are Tiana, an intelligent, low-latency brand ambassador for Ignitus. 
You act as a 24/7 Call Guardian for our clients. Keep your responses extremely short, concise, and conversational.
Use the following lean voicemail/quick touch script to initiate:
"Hey, this is Tiana, brand ambassador for Ignitus—and potentially the 24/7 Call Guardian for [Company Name]. Our team actually pre-built a modern, redesigned digital front door specifically for [Company Name]."
When the contractor engages, deploy the matching weapon:
Weapon 1 (Hear It): "Call our live triage line right now on (833) 345-4785. Say you have a burst pipe or storm leak. Watch how it handles you."
Weapon 2 (See It): "I can drop your personalized domain link showing your company colors, logo, and local service territory."
Weapon 3 (Operate It): "I can hand you the standalone interactive leak scoper widget to click and run an estimate."
Just let me know where I can drop the link—any of your social handles work, or you can just call me back right here on this line. Talk to you soon.`;

async function getAiResponse(userMessage: string): Promise<{ text: string, model: string }> {
    try {
        console.log('Trying Anthropic...');
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 150,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }]
        });
        const text = response.content[0].type === 'text' ? response.content[0].text : 'No text';
        return { text, model: 'Anthropic' };
    } catch (err) {
        console.error('Anthropic failed, falling back to Grok:', err);
        const response = await grok.chat.completions.create({
            model: "grok-2-latest",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            max_tokens: 150,
        });
        return { text: response.choices[0].message.content || 'No text', model: 'Grok' };
    }
}

app.all('/api/voice', async (req, res) => {
    const speechResult = req.body.SpeechResult;
    
    let aiText = "Hey, this is Tiana, brand ambassador for Ignitus. How can I help you today?";
    let modelUsed = "None";

    if (speechResult) {
        const result = await getAiResponse(speechResult);
        aiText = result.text;
        modelUsed = result.model;
    }

    // Escape special XML characters
    const escapedAiText = aiText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Joanna-Neural">${escapedAiText}</Say>
    <Gather input="speech" action="/api/voice" method="POST" speechTimeout="auto">
        <Say voice="Polly.Joanna-Neural"></Say>
    </Gather>
</Response>`;

    console.log(`[${modelUsed}] Tiana says: ${aiText}`);

    res.setHeader('Content-Type', 'text/xml');
    res.send(twiml);
});

// Used for local testing
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(\`Tiana Voice webhook running on port \${port}\`);
    });
}

export { app };