import WebSocket from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.PRIMARY_GEMINI_KEY || process.env.GEMINI_API_KEY;
const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

export function testConnection() {
  const ws = new WebSocket(WS_URL);
  const start = Date.now();

  ws.on('open', () => {
    ws.send(JSON.stringify({
      setup: {
        model: 'models/gemini-2.0-flash-exp',
        generationConfig: { responseModalities: ['AUDIO'] }
      }
    }));
  });

  ws.on('message', () => {
    console.log(`[IGNITUS-ACK] Handshake SUCCESS | Latency: ${Date.now() - start}ms`);
    ws.close();
    process.exit(0);
  });

  ws.on('error', (err) => {
    console.error(`[IGNITUS-FAIL] Error: ${err.message}`);
    process.exit(1);
  });
}

testConnection();
