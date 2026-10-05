"""
IGNITUS MANUS — PERMANENT UNIVERSAL AUTONOMOUS AGENT
=====================================================
A fully autonomous, elite universal agent engineered to run permanently.
Executes Sylvester's directives proficiently, productively, purposefully.

The Ladder:
1. Problem Solving: Obstacles are hurdles to be overcome.
2. Effectuation: Atomize and reconstruct resources to meet challenges.
3. Mitigation: Navigate to the goal without absolute disregard. When in doubt, ask.
4. Litigation: Make sure the story gets told. Pick fights that matter.

Core Missions:
- Task 1: Income Generation (lucrative easy lifts, minimal integration).
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

# ── 1. CINEMATIC OUTREACH DOCTRINE (SEE, TOUCH, FEEL) ──────────────────────
class SeeTouchFeelDirector:
    """
    Produces tight, <=20-second cinematic operator-to-operator outreach pitches.
    Structure:
      0-6s  (PAIN): Get eye-to-eye with the operator on the job site.
      7-13s (SOLUTION): The 60-second interactive scoper + 12s cell dispatch.
      14-20s (SEE, TOUCH, FEEL): Tactile proof on their own mobile device.
    """

    @staticmethod
    def generate_pitch(contractor_name: str, trade: str, domain: str, monthly_leak: int = 18500, paypal_handle: str = None) -> Dict[str, Any]:
        leak_str = f"${monthly_leak:,.0f}"
        handle = (paypal_handle or os.getenv("PAYPAL_ME_HANDLE") or os.getenv("PAYPAL_USERNAME") or "IgnitusCore").replace("https://paypal.me/", "").replace("@", "")

        stage1_url = f"https://paypal.me/{handle}/55USD"
        stage2_url = f"https://paypal.me/{handle}/700USD"
        stage3_url = f"https://paypal.me/{handle}/200USD"
        stage4_url = f"https://paypal.me/{handle}/1500USD"
        
        script_20s = (
            f"You're out on the job site, your phone's in your pocket, and a {leak_str} {trade} contract "
            f"just bounced off your static contact form because nobody answered in 2 hours. "
            f"We plugged that leak. We built a 60-second interactive scoper directly on {domain} "
            f"that quotes the client on mobile and texts the exact ticket to your cell in 12 seconds. "
            f"See the leak, touch the prototype on your own phone right now, and feel what it's like "
            f"to win the job before competitors even check their email. Private link below."
        )

        visual_storyboard = [
            {"timing": "0:00 - 0:06", "visual": "Cinematic close-up of muddy work boots on concrete. Phone screen lighting up with a missed commercial lead notification. Eye-to-eye connection."},
            {"timing": "0:07 - 0:13", "visual": "Crisp macro shot of a thumb selecting trade specs on the 60-second scoper. Immediate SMS dispatch ping arriving on contractor's personal phone."},
            {"timing": "0:14 - 0:20", "visual": "The 'SEE, TOUCH, FEEL' triad: Split screen showing the $0 leak audit, the working 72-hr mobile prototype link, and instant contract acceptance."},
        ]

        return {
            "contractor": contractor_name,
            "trade": trade,
            "domain": domain,
            "duration": "<= 20 seconds",
            "framework": "SEE, TOUCH, FEEL (Operator-to-Operator)",
            "voiceScript": script_20s,
            "storyboard": visual_storyboard,
            "callToAction": "Touch your private staging prototype now: 72-hour test drive.",
            "settlementLinks": {
                "stage1_test": stage1_url,
                "stage2_claim_ground": stage2_url,
                "stage3_video_assets": stage3_url,
                "stage4_command_market": stage4_url,
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
        self.twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

    def dispatch_headless_rcs(self, to_phone: str, message: str) -> bool:
        """Fires the headless RCS/SMS dispatch using Twilio REST API without external dependencies."""
        if not all([self.twilio_sid, self.twilio_token, self.twilio_phone]):
            print("[!] TWILIO KEYS MISSING. Headless RCS is armed but waiting for .env credentials.")
            return False
            
        print(f"[*] ENGAGING HEADLESS RCS DISPATCH TO: {to_phone}")
        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_sid}/Messages.json"
        
        data = urllib.parse.urlencode({
            "To": to_phone,
            "From": self.twilio_phone,
            "Body": message
        }).encode("utf-8")
        
        auth_string = f"{self.twilio_sid}:{self.twilio_token}"
        auth_header = f"Basic {base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')}"
        
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Authorization", auth_header)
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                print(f"[+] HEADLESS RCS FIRED SUCCESSFULLY. SID: {result.get('sid')}")
                return True
        except Exception as e:
            print(f"[-] HEADLESS RCS FAILED: {str(e)}")
            return False

    def run_evolve_now_blitz(self, contractor_name: str = "Viscon General Contracting", domain: str = "viscong.com", trade: str = "Commercial Construction", target_phone: str = None):
        print(f"\n=======================================================")
        print(f"[*] IGNITUS MANUS — EXECUTING EVOLVE NOW OUTREACH BLITZ")
        print(f"[*] Target: {contractor_name} ({domain}) | Trade: {trade}")
        if target_phone:
            print(f"[*] Headless RCS Target: {target_phone}")
        print(f"[*] Voice/RCS Gateway: Toll-Free {self.toll_free} (Tiana AI)")
        print(f"=======================================================\n")

        # 1. Generate 20-second cinematic See, Touch, Feel pitch
        pitch = SeeTouchFeelDirector.generate_pitch(contractor_name, trade, domain)
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

        # 3. Human-in-the-Loop Approval & API Firing
        phone_to_ping = target_phone or os.getenv("TARGET_PHONE_NUMBER")
        if phone_to_ping:
            print(f"\n[!] AWAITING OPERATOR APPROVAL TO FIRE SMS API TO {phone_to_ping}")
            approval = input(">>> Type 'Y' to authorize dispatch, or 'N' to abort: ").strip().upper()
            
            if approval == 'Y':
                # Send the exact See, Touch, Feel pitch + Settlement Link
                sms_payload = f"{pitch['voiceScript']}\n\n{pitch['callToAction']}\n{pitch['settlementLinks']['stage1_test']}"
                self.dispatch_headless_rcs(phone_to_ping, sms_payload)
            else:
                print("[-] DISPATCH ABORTED BY OPERATOR.")
        else:
            print("[!] Skipping live Headless RCS dispatch: No target phone provided.")

        return pitch

if __name__ == "__main__":
    operator = IgnitusManusOperator()
    
    print("\n=======================================================")
    print("[*] IGNITUS MANUS: ONLINE")
    print("[*] STATUS: Elite Universal Agent Armed")
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
