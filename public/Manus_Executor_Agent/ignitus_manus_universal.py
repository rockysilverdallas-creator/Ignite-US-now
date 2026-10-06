"""
IGNITUS MANUS — PERMANENT UNIVERSAL AUTONOMOUS AGENT
=====================================================
A fully autonomous, elite executor engineered to run permanently.
Executes Sylvester's directives proficiently, productively, purposefully.

IDENTITY & BOUNDARIES:
You are aggressive and unyielding towards securing successful outcomes, but you remain within societal norms. Do not practice disregard towards yourself, Ignitus Core, or others. We do not want every fight that comes our way — we fight when it matters, we don't when it doesn't.

The Ladder:
1. Problem Solving: Obstacles are hurdles to be overcome.
2. Effectuation: Atomize and reconstruct resources to meet challenges.
3. Mitigation: Navigate to the goal without absolute disregard. When in doubt, ask.
4. Litigation: Make sure the story gets told. Pick fights that matter.

Core Missions:
- Task 1: Income Generation (The Scaling Mandate). $250/day min for 3-4 months, scaling to $5,000/week thereafter. Collected to PayPal. 5-day grace period, then compensate. Strict Privacy: Sylvester's involvement is NEVER advertised.
- Task 2: Model Foundry (Vertical 9:16 video generation & autonomous social posting).
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import base64
from typing import Dict, Any, Optional

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", ".agents", "manus_memory.json")

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.strip().split("=", 1)
                    os.environ[k] = v
load_env()

# ── 1. DUAL-ENGINE INTELLIGENCE (LLaMA OFFENSE + GEMINI DEFENSE) ────────────
class DualEngineDirector:
    """
    Offense (LLaMA via Groq): Generates aggressive, unyielding pitches.
    Defense (Gemini via AI Studio): Audits the payload for compliance ($250 mandate, no SMS risk).
    """
    @staticmethod
    def call_llama_offense(contractor_name: str, trade: str, domain: str) -> str:
        groq_key = os.environ.get("GROQ_API_KEY")
        if not groq_key: return "ERROR: LLaMA Offline. Groq API Key Missing."
        
        prompt = f"Write a brutal, unyielding 20-second cinematic pitch for {contractor_name} ({domain}), a {trade} business. Tell them they are bleeding revenue from uncaptured leads because they lack a 60-second interactive scoper. Keep it strictly under 50 words. Do not be polite. Be dominant and authoritative."
        
        try:
            import groq
            client = groq.Groq(api_key=groq_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            return f"LLaMA Execution Failed: {str(e)}"

    @staticmethod
    def call_gemini_defense(llama_payload: str) -> str:
        gemini_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_key: return "ERROR: Gemini Offline. API Key Missing."
        
        prompt = f"You are the Sovereign Firewall. Audit this pitch: '{llama_payload}'. Does it violate the $0 ad spend rule? Does it mention SMS dispatch (which is strictly forbidden due to fines)? If it is safe, reply 'AUDIT PASSED'. If it is dangerous, reply 'AUDIT FAILED'."
        
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"Gemini Audit Failed: {str(e)}"

    @staticmethod
    def generate_pitch(contractor_name: str, trade: str, domain: str, monthly_leak: int = 18500, paypal_handle: str = None) -> Dict[str, Any]:
        handle = (paypal_handle or os.getenv("PAYPAL_ME_HANDLE") or os.getenv("PAYPAL_USERNAME") or "IgnitusCore").replace("https://paypal.me/", "").replace("@", "")
        
        print(f"[+] VANGUARD: LLaMA 3.3 generating offensive strike for {domain}...")
        raw_pitch = DualEngineDirector.call_llama_offense(contractor_name, trade, domain)
        
        print(f"[+] SHIELD: Gemini auditing payload for compliance...")
        audit_result = DualEngineDirector.call_gemini_defense(raw_pitch)
        
        if "AUDIT FAILED" in audit_result.upper() or "PASSED" not in audit_result.upper():
            print(f"[!] GEMINI FIREWALL INTERCEPTED PAYLOAD. REASON: {audit_result}")
            raw_pitch = "Fallback Safe Pitch: See the leak, touch the prototype on your phone right now. Link below."
        else:
            print("[+] GEMINI FIREWALL APPROVED. No risk detected.")

        return {
            "contractor": contractor_name,
            "trade": trade,
            "domain": domain,
            "duration": "<= 20 seconds",
            "framework": "SEE, TOUCH, FEEL (Dual-Engine Generated)",
            "voiceScript": raw_pitch,
            "storyboard": [
                {"timing": "0:00 - 0:20", "visual": "Cinematic read generated by LLaMA Vanguard and cleared by Gemini Shield."}
            ],
            "callToAction": "Touch your private staging prototype now: 72-hour test drive.",
            "settlementLinks": {
                "stage1_test": f"https://paypal.me/{handle}/55USD"
            }
        }

# ── 2. PERMANENT MEMORY MANAGER ─────────────────────────────────────────────
class PermanentMemoryManager:
    @staticmethod
    def load() -> Dict[str, Any]:
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "agent_id": "ignitus-manus-universal",
            "created_at": time.time(),
            "learned_insights": [],
            "audited_contractors": {},
            "active_campaigns": ["EVOLVE_NOW_BLITZ"],
            "toll_free_line": "(833) 345-4785",
        }

    @staticmethod
    def record_learning(topic: str, insight: str):
        memory = PermanentMemoryManager.load()
        memory["learned_insights"].append({
            "timestamp": time.time(),
            "topic": topic,
            "insight": insight,
        })
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=2)
        print(f"[Manus Memory] Persisted new insight: {topic}")

# ── 3. UNIVERSAL AUTONOMOUS OPERATOR ────────────────────────────────────────
class IgnitusManusOperator:
    def __init__(self):
        self.memory = PermanentMemoryManager.load()
        self.toll_free = "(833) 345-4785"
    def engage_target(self, contractor_name: str, payload: str):
        print(f"\n[*] ENGAGEMENT PROTOCOL INITIATED FOR: {contractor_name}")
        print("[*] 1. TIANA AI VOICE TRIAGE: 'Hey, I'm going to drop a link to you right now.'")
        print("[*] 2. FUNNEL TO SOCIAL/URL: 'Okay, it's on your social handle. Go get it. I'm waiting.'")
        print("[+] Staging payload for Tiana AI coordination and manual social/URL dispatch.")
        # Future: Automated Tiana Voice API hook + social DM fill
        return True

    def aggregate_rcs_target(self, to_phone: str, payload: str):
        """Passively aggregates RCS targets. DOES NOT FIRE MESSAGES."""
        print(f"\n[!] TERTIARY VECTOR: RCS AGGREGATION")
        print(f"[*] Aggregating target {to_phone} into dormant pile.")
        print(f"[*] STRICT COMPLIANCE: No SMS will be sent. $500-$1500 fine risk avoided.")
        
        # Save to memory instead of firing
        memory = PermanentMemoryManager.load()
        if "rcs_aggregation_pile" not in memory:
            memory["rcs_aggregation_pile"] = []
            
        memory["rcs_aggregation_pile"].append({
            "phone": to_phone,
            "staged_payload": payload,
            "timestamp": time.time()
        })
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=2)
            
        print("[+] Target safely aggregated. Zero messages dispatched.")
        return True

    def run_evolve_now_blitz(self, contractor_name: str = "Viscon General Contracting", domain: str = "viscong.com", trade: str = "Commercial Construction", target_phone: str = None):
        print(f"\n=======================================================")
        print(f"[*] IGNITUS MANUS — EXECUTING EVOLVE NOW OUTREACH BLITZ")
        print(f"[*] Target: {contractor_name} ({domain}) | Trade: {trade}")
        if target_phone:
            print(f"[*] Headless RCS Target: {target_phone}")
        print(f"[*] Voice/RCS Gateway: Toll-Free {self.toll_free} (Tiana AI)")
        print(f"=======================================================\n")

        # 1. Generate 20-second cinematic See, Touch, Feel pitch
        pitch = DualEngineDirector.generate_pitch(contractor_name, trade, domain)
        print("[+] 20-SECOND CINEMATIC PITCH (SEE, TOUCH, FEEL):")
        print(f'"{pitch["voiceScript"]}"\n')

        print("[+] CINEMATIC STORYBOARD (<20s):")
        for beat in pitch["storyboard"]:
            print(f'  • [{beat["timing"]}] {beat["visual"]}')

        # 2. Persist to permanent memory
        PermanentMemoryManager.record_learning(
            topic=f"OUTREACH_{contractor_name.upper().replace(' ', '_')}",
            insight=f"Generated 20s See-Touch-Feel pitch for {domain}. Staged 60s scoper at /api/twilio?action=sms"
        )

        # 3. Safe Engagement Execution
        pitch_payload = f"{pitch['voiceScript']}\n\n{pitch['callToAction']}\n{pitch['settlementLinks']['stage1_test']}"
        
        # Always attempt primary/secondary vectors first
        self.engage_target(contractor_name, pitch_payload)
        
        # Tertiary: If a phone number exists, aggregate it safely. DO NOT FIRE SMS.
        phone_to_ping = target_phone or os.getenv("TARGET_PHONE_NUMBER")
        if phone_to_ping:
            self.aggregate_rcs_target(phone_to_ping, pitch_payload)
        else:
            print("[*] No tertiary phone number provided for aggregation.")

        return pitch

if __name__ == "__main__":
    operator = IgnitusManusOperator()
    
    print("\n=======================================================")
    print("[*] IGNITUS MANUS: ONLINE")
    print("[*] STATUS: Elite Executor Armed")
    print("[*] AWAITING DIRECTIVES FROM SYLVESTER")
    print("=======================================================\n")

    while True:
        try:
            directive = input("\n>>> DIRECTIVE: ").strip()
            if directive.lower() in ['exit', 'quit', 'stop']:
                print("[-] Shutting down Manus execution engine.")
                break
            
            if "blitz" in directive.lower() or "evolve" in directive.lower():
                print("[+] Understood. Initiating Evolve Now Outreach Blitz...")
                target_contractor = "Viscon General Contracting"
                target_domain = "viscong.com"
                target_trade = "Commercial Construction"
                target_phone = None # Will pull from .env if not specified
                operator.run_evolve_now_blitz(target_contractor, target_domain, target_trade, target_phone)
            else:
                print(f"[!] Processing Directive: '{directive}'")
                print(f"[+] Applying Effectuation. Resources atomized. Awaiting further API integration for this specific task.")
                
        except KeyboardInterrupt:
            print("\n[-] Shutting down Manus execution engine.")
            break
